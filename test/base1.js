// test/api.js
import process from 'node:process'
import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import fastify from '../server.js'

let accessToken, refreshToken
let defaultOrganizationId, defaultSiteId
let organizationId, siteId, deviceId

test.before(async () => {
  if (!fastify.server.listening) {
    // ✅ 避免重複啟動
    await fastify.ready()
  }
})

test.after(async () => {
  await fastify.close() // ✅ 確保測試結束時關閉伺服器
  // 🚀 確保測試結束後完全退出
  setTimeout(() => {
    console.log('🛑 強制退出測試進程')
    process.exit(0)
  }, 1000)
})

test('🔑 /api/v1/auth/login 應該回傳 JWT', async () => {
  const res = await request(fastify.server)
    .post('/api/v1/auth/login')
    .send({ username: 'mbv05522@msssg.com', password: '12345678' })

  assert.strictEqual(res.status, 200)
  assert.ok(res.body.accessToken)
  accessToken = res.body.accessToken // ✅
  refreshToken = res.body.refreshToken // ✅
})

test('🆔 /api/v1/auth/profile 應該回傳用戶資料', async () => {
  const res = await request(fastify.server).get('/api/v1/auth/profile').set('Authorization', `Bearer ${accessToken}`)

  assert.strictEqual(res.status, 200)
  defaultOrganizationId = res.body.organizations[0].organization_id // ✅
  defaultSiteId = res.body.organizations[0].sites[0].site_id // ✅
})

test('🏢 /api/v1/organization 應該成功建立組織', async () => {
  const res = await request(fastify.server)
    .post('/api/v1/organization')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ organization_name: 'Test Organization', site_name: 'Main Site' })

  assert.strictEqual(res.status, 201)
  organizationId = res.body.organization.id // ✅
})

test('📝 /api/v1/organization/:id 應該成功編輯組織名稱', async () => {
  const res = await request(fastify.server)
    .put(`/api/v1/organization/${organizationId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ name: 'Updated Organization' })

  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.organization.name, 'Updated Organization')
})

test('📋 /api/v1/organization 應該回傳組織列表', async () => {
  const res = await request(fastify.server).get('/api/v1/organization').set('Authorization', `Bearer ${accessToken}`)

  assert.strictEqual(res.status, 200)
  assert.ok(res.body.organizations.some((org) => org.organization_id === organizationId))
})

// ===================================================================================================

test('🏢 /api/v1/site 應該成功建立站點', async () => {
  const res = await request(fastify.server)
    .post('/api/v1/site')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ name: 'Test Site', organization_id: organizationId })

  assert.strictEqual(res.status, 201)
  siteId = res.body.site.id // ✅
})

test('📝 /api/v1/site/:id 應該成功編輯站點名稱', async () => {
  const res = await request(fastify.server)
    .put(`/api/v1/site/${siteId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ name: 'Updated Site' })

  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.site.name, 'Updated Site')
})

test('📋 /api/v1/organization/:organization_id/sites 應該回傳站點列表', async () => {
  const res = await request(fastify.server)
    .get(`/api/v1/organization/${organizationId}/sites`)
    .set('Authorization', `Bearer ${accessToken}`)

  assert.strictEqual(res.status, 200)
  assert.ok(res.body.sites.some((site) => site.site_id === siteId))
})

// ===================================================================================================
test('📡 /api/v1/device 應該成功新增設備', async () => {
  // const uniqueClientId = `device_${Date.now()}` // 確保每次測試 client_id 都不同
  // TODO: 目前要先在裝置型錄裡填入，在要macaddr,serial_number去比
  const macaddr = 'a8:f7:e0:dd:62:17'
  const serial_number = '1234567890abcdef1234567890abcdef'

  const res = await request(fastify.server).post('/api/v1/device').set('Authorization', `Bearer ${accessToken}`).send({
    organization_id: defaultOrganizationId,
    site_id: defaultSiteId,
    macaddr,
    serial_number
  })

  if (res.status === 201) {
    deviceId = res.body.device.id
  } else if (res.status === 400) {
    // 👉 如果是因為已存在，那就查一下設備 ID
    const queryRes = await request(fastify.server).get('/api/v1/device').set('Authorization', `Bearer ${accessToken}`)

    const found = queryRes.body.devices.find((d) => d.macaddr === macaddr && d.serial_number === serial_number)
    console.log('🔍 所有設備:', queryRes.body.devices)
    assert.ok(found, '找不到已存在的設備')
    deviceId = found.id
  } else {
    assert.fail(`❌ 非預期的狀態碼: ${res.status}`)
  }
})

test('🔄 /api/v1/device/:id/config 應該成功變更設備的 site 與 organization', async () => {
  const res = await request(fastify.server)
    .put(`/api/v1/device/${deviceId}/config`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      new_site_id: defaultSiteId,
      new_organization_id: defaultOrganizationId
    })

  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.device.site_id, defaultSiteId)
  assert.strictEqual(res.body.device.organization_id, defaultOrganizationId)
})

test('📋 /api/v1/device 應該回傳設備列表', async () => {
  const res = await request(fastify.server)
    .get(`/api/v1/device`)
    .set('Authorization', `Bearer ${accessToken}`)
    .query({ organization_id: defaultOrganizationId, site_id: defaultSiteId })

  assert.strictEqual(res.status, 200)
})

test('🗑️ /api/v1/device/:id 應該成功刪除設備', async () => {
  const res = await request(fastify.server)
    .delete(`/api/v1/device/${deviceId}`)
    .set('Authorization', `Bearer ${accessToken}`)

  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.message, 'Device deleted successfully')
})

test('❌ /api/v1/organization/:id 應該成功刪除組織', async () => {
  const res = await request(fastify.server)
    .delete(`/api/v1/organization/${organizationId}`)
    .set('Authorization', `Bearer ${accessToken}`)

  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.message, 'ok')
})

// ===================================================================================================
// 其他 API 跑過一遍
test('📋 /api/v1/site/{site_id}/devices 應該回傳站點內的設備列表', async () => {
  const res = await request(fastify.server)
    .get(`/api/v1/site/${defaultSiteId}/devices`)
    .set('Authorization', `Bearer ${accessToken}`)

  assert.strictEqual(res.status, 200)
})

test('📋 /api/v1/organization/{organization_id}/user-role 應該回傳組織內的用戶列表', async () => {
  const res = await request(fastify.server)
    .get(`/api/v1/organization/${defaultOrganizationId}/user-role`)
    .set('Authorization', `Bearer ${accessToken}`)

  assert.strictEqual(res.status, 200)
})

test('📋 /api/v1/organization/{organization_id}/devices 應該回傳組織內的裝置列表', async () => {
  const res = await request(fastify.server)
    .get(`/api/v1/organization/${defaultOrganizationId}/devices`)
    .set('Authorization', `Bearer ${accessToken}`)

  assert.strictEqual(res.status, 200)
})

test('📋 /api/v1/organization/{organization_id}/sites 應該回傳組織內的站點列表', async () => {
  const res = await request(fastify.server)
    .get(`/api/v1/organization/${defaultOrganizationId}/sites`)
    .set('Authorization', `Bearer ${accessToken}`)

  assert.strictEqual(res.status, 200)
})

test('🆕 /api/v1/auth/refresh-token 應該回傳新的 Access Token', async () => {
  const res = await request(fastify.server).post('/api/v1/auth/refresh-token').send({ refreshToken })

  assert.strictEqual(res.status, 200)
  assert.ok(res.body.accessToken)
  accessToken = res.body.accessToken
})

test('🚪 /api/v1/auth/logout 應該成功登出', async () => {
  const res = await request(fastify.server).post('/api/v1/auth/logout').send({ refreshToken })

  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.message, 'Logged out successfully.')

  // 測試登出後 Refresh Token 失效
  const resInvalid = await request(fastify.server).post('/api/v1/auth/refresh-token').send({ refreshToken })

  assert.strictEqual(resInvalid.status, 401)
  assert.strictEqual(resInvalid.body.error, 'Invalid refresh token')
})
// dummy for CodeRabbit

// dummy for CodeRabbit
