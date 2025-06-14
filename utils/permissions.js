// utils/permissions.js
import { Site, DeviceBind } from '../models/index.js'

/**
 * 1️⃣ 只查 `organization_id`，適用於需要 `organization_id` 但不涉及 `site_id` 的 API
 */
export async function getOrgId(request) {
  return { organization_id: request.params.organization_id }
}

/**
 * 2️⃣ 查 `organization_id` 和 `site_id`，適用於 `Site` 相關 API
 *    主要是透過 `site_id` 查 `organization_id`
 */
export async function getOrgIdFromSite(request, reply) {
  const site_id = request.params?.site_id || request.params?.id

  if (!site_id) {
    return reply.code(400).send({ error: 'Missing site_id' })
  }

  const siteRecord = await Site.findByPk(site_id)
  if (siteRecord) {
    console.log(`✅ 從 site_id=${site_id} 找到 organization_id=${siteRecord.organization_id}`)
    return { organization_id: siteRecord.organization_id, site_id }
  } else {
    console.log('❌ 找不到站點:', site_id)
    return reply.code(404).send({ error: 'Site not found' })
  }
}

/**
 * 3️⃣ 查 `organization_id` 和 `site_id`，適用於 `DeviceBind` 相關 API
 *    如果 `device_id` 存在，則從 `devices` 表查詢 `organization_id` 和 `site_id`
 */
export async function getOrgOrSiteId(request, reply) {
  let organization_id =
    request.body?.organization_id || request.query?.organization_id || request.params?.organization_id || null
  let site_id = request.body?.site_id || request.query?.site_id || request.params?.site_id || null
  const device_id = request.params?.device_id

  // 如果 API 傳的是 `device_id`，則從 `devices` 表查詢 `organization_id` 和 `site_id`
  if (!organization_id && !site_id && device_id) {
    const deviceRecord = await DeviceBind.findByPk(device_id)
    if (deviceRecord) {
      organization_id = deviceRecord.organization_id
      site_id = deviceRecord.site_id
      console.log(`✅ 從 device_id=${device_id} 找到 organization_id=${organization_id}, site_id=${site_id}`)
    } else {
      console.log('❌ 找不到設備:', device_id)
      return reply.code(404).send({ error: 'Device not found' })
    }
  }

  return { organization_id, site_id }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
