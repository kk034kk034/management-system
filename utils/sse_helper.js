// utils/sse_helper.js
/**
 * SSE 事件推送:
 * sendToApp() & sendObjectToAppSingle() 讓設備數據可以推送到所有關聯用戶，並支援單一設備回應。
 */
import { DeviceBind, UserRole } from '../models/index.js'
import { clients } from './shared_state.js'

export const sendToApp = async (tagName, jsonData, deviceID) => {
  try {
    const data_json = JSON.stringify(jsonData)

    // ✅ 如果 `serialNo` 存在，則只發送給特定 `sn` 的客戶端
    let serialNo = jsonData.serialNo || 0
    if (serialNo > 0) {
      clients.forEach((c) => {
        if (serialNo === c.sn) {
          console.log(`📤 [SSE] 單一發送數據給 sn=${serialNo}`)
          c.res.write(`event: ${tagName}\ndata: ${data_json}\n\n`)
        }
      })
      return
    }

    // ✅ 查詢 `DeviceBind`，確認設備是否存在
    const foundDevice = await DeviceBind.findOne({
      where: { client_id: deviceID }
    })
    if (!foundDevice) {
      console.log(`⚠️ [SSE] 找不到設備 ${deviceID}`)
      return
    }

    // ✅ 這裡應該是指原本的share功能，也就是現在的org內用戶都要收到
    const organizationId = foundDevice.organization_id // 取得裝置所屬 org_id
    const userRoles = await UserRole.findAll({
      // 找出此 org_id 底下所有使用者 id
      where: { organization_id: organizationId },
      attributes: ['user_id']
    })
    const sharedUserIds = userRoles.map((ur) => ur.user_id)
    // 遍歷 `clients`，找到符合 `user_id` 的用戶並推送數據
    clients.forEach((c) => {
      if (sharedUserIds.includes(c.id)) {
        console.log(`📤 [SSE] 發送數據給用戶 ${c.id}`)
        c.res.write(`event: ${tagName}\ndata: ${data_json}\n\n`)
      }
    })
  } catch (error) {
    console.error(`❌ [SSE] sendToApp 出錯: ${error.message}`)
  }
}

export const sendObjectToAppSingle = async (tagName, jsonData, userId, sn) => {
  try {
    const data_json = JSON.stringify(jsonData)
    clients.forEach((client) => {
      if (client.id === userId && client.sn === sn) {
        client.res.write(`event: ${tagName}\ndata: ${data_json}\n\n`)
      }
    })
  } catch (error) {
    console.error(`❌ SSE Single Error: ${error.message}`)
  }
}
