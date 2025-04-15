// scripts/stats_shared_devices.js
import { DeviceBind, UserRole } from '../models/index.js'

const statsSharedOrgs = async () => {
  // 取得每個 org 的裝置數
  const devices = await DeviceBind.findAll({
    attributes: ['organization_id'],
    raw: true
  })

  const deviceOrgCount = {}
  for (const { organization_id } of devices) {
    deviceOrgCount[organization_id] ??= 0
    deviceOrgCount[organization_id]++
  }

  // 取得每個 org 的用戶 set
  const userRoles = await UserRole.findAll({
    attributes: ['organization_id', 'user_id'],
    raw: true
  })

  const orgUserMap = new Map()
  for (const { organization_id, user_id } of userRoles) {
    const userSet = orgUserMap.get(organization_id) || new Set()
    userSet.add(user_id)
    orgUserMap.set(organization_id, userSet)
  }

  // 統計有被 shared 的 org（用戶數 > 1）
  const result = []

  for (const orgId of Object.keys(deviceOrgCount)) {
    const userSet = orgUserMap.get(Number(orgId)) || new Set()
    if (userSet.size > 1) {
      result.push({
        organization_id: Number(orgId),
        device_count: deviceOrgCount[orgId],
        user_count: userSet.size
      })
    }
  }

  console.log(`✅ 被 shared 的 org 數量: ${result.length}`)
  console.table(result)
}

statsSharedOrgs()
