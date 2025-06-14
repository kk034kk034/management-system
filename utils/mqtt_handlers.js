// utils/mqtt_handlers.js
import { DeviceCatalog, DeviceBind, User } from '../models/index.js'
import { loadPinCodeMap } from '../utils/pin_code_loader.js'
import crypto from 'node:crypto'

let pinCodeMapCache = null

async function getPinCodeMap() {
  if (!pinCodeMapCache) {
    pinCodeMapCache = await loadPinCodeMap()
  }
  return pinCodeMapCache
}

export async function calDeviceID(payload) {
  const { macaddr, modelname, vendor, sn } = payload
  const pinCodeMap = await getPinCodeMap()

  const cleanedMac = macaddr?.replace(/:/g, '')
  const pinCode = pinCodeMap[modelname] || '12345678'
  const source = `${pinCode}${sn}${cleanedMac}${vendor}${modelname}`
  return crypto.createHash('md5').update(source).digest('hex')
}

export async function addnewToRedis(fastify, payload) {
  const { macaddr, modelname, vendor, sn, type, version } = payload
  const mac = macaddr?.replace(/:/g, '')
  const timestamp = Date.now()
  const PAYLOAD_TTL_SECONDS = 3600 // Keep for 1 hour

  // Write to ZSet (sorted list)
  const expiredBefore = timestamp - PAYLOAD_TTL_SECONDS * 1000
  await fastify.redis.zremrangebyscore('addnew_list', 0, expiredBefore)
  await fastify.redis.zadd('addnew_list', timestamp, mac)

  // Write to Hash (device data)
  await fastify.redis.hset(`addnew:${mac}`, {
    deviceID: await calDeviceID(payload),
    version,
    macaddr: mac,
    modelname,
    type,
    vendor,
    sn,
    timestamp
  })
  await fastify.redis.expire(`addnew:${mac}`, PAYLOAD_TTL_SECONDS)
}

// ==============================================================================================================
export async function handleAddnew(fastify, deviceID, payload) {
  // check deviceID
  const expectedID = await calDeviceID(payload)
  if (expectedID !== deviceID) {
    fastify.log.warn(`❌ deviceID mismatch: ${expectedID} !== ${deviceID}`)
    fastify.mqtt.publish(`/${deviceID}/control`, { cmd: 'config_unbind' })
    return false
  }

  // device_addnew auto-write-in device_catalog. >> TODO: InfoSec-Prob.
  const { macaddr, sn, modelname } = payload
  let catalogDevice = await DeviceCatalog.findOne({
    where: { macaddr: macaddr }
  })
  if (!catalogDevice) {
    try {
      DeviceCatalog.create({
        macaddr: macaddr,
        serial_number: sn,
        modelname
      })
      fastify.log.info(`✅ New device written to DB: ${deviceID}`)
    } catch (err) {
      return fastify.log.warn(err)
    }
  }

  // If backend has binding record, automatically rebind the device
  let boundDevice = await DeviceBind.findOne({
    where: { macaddr: macaddr }
  })
  if (boundDevice) {
    let foundUser = await User.findOne({ where: { id: boundDevice.user_id } })
    fastify.log.info(`auto rebind deviceID: ${deviceID}`)
    const payloadToSend = {
      cmd: 'config_bind',
      client_id: boundDevice.client_id,
      username: foundUser.username,
      email: foundUser.email
    }
    fastify.mqtt.publish(`/${deviceID}/control`, payloadToSend)
    return true
  }

  // payload cache in redis
  await addnewToRedis(fastify, payload)
}

export async function handleLogin(fastify, deviceID, payload) {
  // Check if device already exists
  const device = await DeviceBind.findOne({
    where: { client_id: deviceID }
  })
  if (!device) {
    fastify.log.warn(`⚠️ Cannot find in DeviceBind: ${deviceID}`)
    fastify.mqtt.publish(`/${deviceID}/control`, { cmd: 'config_unbind' })
    return false
  }

  // [舊版] firstboot 好像等於 bind device，新版才切分addnew/bind流程
  if (payload.firstboot == 0) {
    // bind device
    fastify.mqtt.publish('/' + deviceID + '/control', '{"cmd":"config_firstboot"}')
    // force viewer
    fastify.mqtt.publish('/' + deviceID + '/control', '{"cmd":"config_viewer"}')
  }

  // Update device basic information
  await device.update({
    fwver: payload.fwver,
    description: payload.description,
    logintime: new Date()
  })
  fastify.log.info(`📝 Device data updated: ${deviceID}`)
}

export async function handleUnbind(fastify, deviceID, payload) {
  const { client_id } = payload
  const expectedID = await calDeviceID(payload)

  if (expectedID !== deviceID) {
    return fastify.log.warn(`❌ deviceID 不一致: ${expectedID} !== ${deviceID}`)
  }

  const bind = await DeviceBind.findOne({
    where: { client_id }
  })
  if (!bind) {
    return fastify.log.warn(`⚠️ Cannot find binding record, unable to unbind: ${client_id}`)
  }

  // TODO: 需要集中到一個 function, 可能還有其他資料要一併刪除
  bind.destroy()
  fastify.log.info(`🗑️ Unbound: ${client_id}`)
}
// dummy for CodeRabbit

// dummy for CodeRabbit
