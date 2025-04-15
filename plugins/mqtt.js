// plugins/mqtt.js
import FastifyPlugin from 'fastify-plugin'
import mqtt from 'mqtt'
import dotenv from 'dotenv'
import process from 'node:process'
import { sendToApp, sendObjectToAppSingle } from '../utils/sse_helper.js'
import { getLogger, console_log } from '../utils/logger.js'
import { deviceDataCache, pendingRequests } from '../utils/shared_state.js'
import { handleAddnew, handleLogin, handleUnbind } from '../utils/mqtt_handlers.js'

dotenv.config()
const mqttPushLogger = getLogger('mqtt_push.log')

async function mqttConnector(fastify) {
  const mqttOptions = {
    port: parseInt(process.env.MQTT_PORT, 10),
    clientId: process.env.MQTT_CLIENT_ID,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000, // Auto-reconnect interval
    clean: true // Clean session
  }

  const brokerUrl = `mqtt://${process.env.MQTT_BROKER}`
  const client = mqtt.connect(brokerUrl, mqttOptions)

  client.on('connect', () => {
    fastify.log.info('✅ MQTT 連線成功')

    const topics = ['/+/addnew', '/+/unbind', '/+/login', '/+/stats', '/+/config/+']
    client.subscribe(topics, (err, granted) => {
      if (err) {
        fastify.log.error('❌ 訂閱 MQTT Topic 失敗:', err)
      } else {
        fastify.log.info(`📡 訂閱成功: ${granted.map((g) => g.topic).join(', ')}`)
      }
    })
  })

  client.on('error', (err) => {
    fastify.log.error('❌ MQTT 連線錯誤:', err)
  })

  client.on('message', async (topic, message) => {
    try {
      fastify.log.info(`📩 收到 MQTT 訊息: Topic = ${topic}, Message = ${message.toString()}`)

      const [, deviceID, category, subcategory = null] = topic.split('/')
      if (!deviceID || (deviceID.length !== 32 && deviceID.length !== 36)) {
        return fastify.log.warn('⚠️ 無效的 deviceID')
      }

      let payload
      try {
        payload = JSON.parse(message.toString().trim())
        payload.deviceID = deviceID // 添加deviceID到payload中
      } catch {
        return fastify.log.error('❌ JSON 解析錯誤')
      }

      switch (category) {
        case 'addnew':
          await handleAddnew(fastify, deviceID, payload)
          break
        case 'login':
          await handleLogin(fastify, deviceID, payload)
          break
        case 'unbind':
          await handleUnbind(fastify, deviceID, payload)
          break
        case 'stats':
          if (payload.viewer_st) {
            sendToApp('stats_viewer', payload, deviceID)
          }
          if (payload.clients_st) {
            sendToApp('stats_clients', payload, deviceID)
          }
          break
        case 'config':
          if (subcategory === 'viewer') {
            deviceDataCache[deviceID] = payload
            // sendToApp('config_viewer', payload, deviceID)
            const info = pendingRequests[deviceID]
            if (info) {
              sendObjectToAppSingle('config_viewer', payload, info.userId, info.sn)
              console_log(
                mqttPushLogger,
                `[MQTT PUSH] deviceID=${deviceID}, userId=${info.userId}, sn=${info.sn}`,
                'data:',
                payload
              )
              delete pendingRequests[deviceID]
            } else {
              sendToApp('config_viewer', payload, deviceID)
              console_log(
                mqttPushLogger,
                `[MQTT FALLBACK] deviceID=${deviceID} no pendingRequest, using sendToApp`,
                'data:',
                payload
              )
            }
          } else if (subcategory === 'cfgset') {
            sendToApp('config_cfgset', payload, deviceID)
          } else if (subcategory === 'cfgget') {
            sendToApp('config_cfgget', payload, deviceID)
          }
          break
        default:
          fastify.log.warn(`❓ 未知類別: ${category}`)
      }
    } catch (err) {
      fastify.log.error('❌ MQTT Error:', err)
      console.error(err)
    }
  })

  // 將 MQTT 客戶端綁定到 Fastify，並提供 publish 方法
  fastify.decorate('mqtt', {
    client,
    publish: (topic, message) => {
      client.publish(topic, JSON.stringify(message), { qos: 1 }, (err) => {
        if (err) {
          fastify.log.error('❌ 發送 MQTT 訊息失敗:', err)
        } else {
          fastify.log.info(`📤 已發送 MQTT 訊息: ${topic} -> ${JSON.stringify(message)}`)
        }
      })
    }
  })

  fastify.addHook('onClose', (instance, done) => {
    fastify.log.info('🔌 Disconnected from MQTT')
    client.end(true, done) // ✅ Ensure MQTT connection is closed
  })
}

export default FastifyPlugin(mqttConnector)
