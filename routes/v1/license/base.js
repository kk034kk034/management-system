// routes/v1/license/base.js
import { DeviceBind, License, DeviceLicense, Pack, PackFeature } from '../../../models/index.js'
import swagger from '../../../swagger/index.js'

export default async function (fastify) {
  /**
   * ✅ 允許用戶一次性購買多個 License
   * ✅ 可擴展：未來可增加付款方式、折扣等邏輯
   */
  fastify.post(
    '/',
    {
      schema: swagger.buyLicense,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        const user_id = request.user.id
        const { pack_id, quantity, duration_in_days } = request.body

        if (!pack_id || !quantity || !duration_in_days) {
          return reply.code(400).send({ error: 'Missing required fields' })
        }

        // 🔍 確保 Pack 存在
        const foundPack = await Pack.findByPk(pack_id)
        if (!foundPack) {
          return reply.code(400).send({ error: 'Invalid pack_id, Pack not found' })
        }

        const licenses = []
        for (let i = 0; i < quantity; i++) {
          const newLicense = await License.create({
            user_id,
            pack_id,
            duration_in_days
          })
          licenses.push(newLicense)
        }

        return reply.send({
          message: 'License purchased successfully',
          licenses
        })
      } catch (error) {
        return reply.code(500).send({ error: error.message })
      }
    }
  )

  /**
   * ✅ 用戶可以查看自己擁有的 License
   * ✅ 可擴展：未來可以根據 status 進行篩選
   */
  fastify.get(
    '/',
    {
      schema: swagger.getUserLicenses,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        const user_id = request.user.id

        const licenses = await License.findAll({
          where: { user_id },
          attributes: ['id', 'license_key', 'pack_id', 'duration_in_days', 'status', 'purchase_date']
        })

        return reply.send({ licenses })
      } catch (error) {
        return reply.code(500).send({ error: error.message })
      }
    }
  )

  /**
   * ✅ 綁定時 organization_id 來自 device，確保 License 正確對應
   * ✅ 確保 License 是 unused，避免重複綁定
   * ✅ 設備 license_end_date 依據 duration_in_days 計算
   */
  fastify.post(
    '/bind_device/:device_id',
    {
      schema: swagger.bindLicense,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        const { device_id } = request.params
        const { license_id } = request.body
        const user_id = request.user.id

        // 🔍 確保 License 屬於該用戶
        const foundLicense = await License.findOne({
          where: { id: license_id, user_id, status: 'unused' }
        })
        if (!foundLicense) {
          return reply.code(400).send({ error: 'License not found or already used' })
        }

        // 🔍 確保設備存在
        const foundDevice = await DeviceBind.findByPk(device_id)
        if (!foundDevice) {
          return reply.code(404).send({ error: 'Device not found' })
        }

        // ✅ 記錄 License 綁定到設備
        await DeviceLicense.create({
          device_id,
          license_id,
          organization_id: foundDevice.organization_id,
          license_start_date: new Date(),
          license_end_date: new Date(Date.now() + foundLicense.duration_in_days * 86400000), // 到期日
          remaining_days: foundLicense.duration_in_days
        })

        // ✅ 更新 License 狀態
        await foundLicense.update({ status: 'activated' })

        return reply.send({
          message: 'License bound to DeviceBind successfully'
        })
      } catch (error) {
        return reply.code(500).send({ error: error.message })
      }
    }
  )

  /**
   * ✅ 回傳設備所有綁定的 License
   * ✅ 包含 license_key、status、license_end_date、remaining_days
   */
  fastify.get(
    '/bind_device/:device_id',
    {
      schema: swagger.getDeviceLicenses,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        const { device_id } = request.params

        // 🔍 確保設備存在
        const foundDevice = await DeviceBind.findByPk(device_id)
        if (!foundDevice) {
          return reply.code(404).send({ error: 'Device not found' })
        }

        // 🔍 查詢設備綁定的 License
        const deviceLicenses = await DeviceLicense.findAll({
          where: { device_id },
          include: [
            {
              model: License,
              attributes: ['id', 'license_key', 'status', 'duration_in_days', 'purchase_date']
            }
          ]
        })

        return reply.send({ device_id, licenses: deviceLicenses })
      } catch (error) {
        return reply.code(500).send({ error: error.message })
      }
    }
  )

  /**
   * ✅ 確保 License 轉移時剩餘時間不變
   * ✅ 允許跨設備轉移 License
   */
  fastify.post(
    '/transfer_device/:from_device_id/:to_device_id',
    {
      schema: swagger.transferLicense,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        const { from_device_id, to_device_id } = request.params
        const { license_id } = request.body

        const existingLicense = await DeviceLicense.findOne({
          where: { device_id: from_device_id, license_id }
        })

        if (!existingLicense) {
          return reply.code(400).send({ error: 'License not found on source DeviceBind' })
        }

        const remainingDays = Math.max(
          0,
          Math.ceil((existingLicense.license_end_date - new Date()) / (1000 * 60 * 60 * 24))
        )

        const newTransferCount = existingLicense.license_transfer_count + 1
        await existingLicense.destroy()
        await DeviceLicense.create({
          device_id: to_device_id,
          license_id,
          organization_id: existingLicense.organization_id,
          license_start_date: new Date(),
          license_end_date: new Date(Date.now() + remainingDays * 86400000),
          remaining_days: remainingDays,
          license_transfer_count: newTransferCount // ✅ 累計轉移次數
        })

        return reply.send({ message: 'License transferred successfully' })
      } catch (error) {
        return reply.code(500).send({ error: error.message })
      }
    }
  )

  /**
   * ✅ 查詢 DeviceLicense 內的 license，取得 pack_id
   * ✅ 查詢 PackFeature 內 pack_id 對應的 feature_name
   * ✅ 回傳 unlocked_features 陣列，讓前端知道解鎖的功能
   */
  fastify.get(
    '/feat_unlock_device/:device_id',
    {
      schema: swagger.getDeviceFeatures,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        const { device_id } = request.params

        // 🔍 確保設備存在
        const foundDevice = await DeviceBind.findByPk(device_id)
        if (!foundDevice) {
          return reply.code(404).send({ error: 'Device not found' })
        }

        // 🔍 查詢設備綁定的 License
        const deviceLicenses = await DeviceLicense.findAll({
          where: { device_id },
          include: [{ model: License, attributes: ['id', 'pack_id'] }]
        })

        if (deviceLicenses.length === 0) {
          return reply.send({ device_id, unlocked_features: [] })
        }

        // 🔍 取得所有該設備的 `pack_id`
        const packIds = [...new Set(deviceLicenses.map((dl) => dl.license.pack_id))]

        // 🔍 查詢這些 `pack_id` 對應的 `feature_name`
        const unlockedFeatures = await PackFeature.findAll({
          where: { pack_id: packIds },
          attributes: ['feature_name'],
          raw: true
        })

        return reply.send({
          device_id,
          unlocked_features: unlockedFeatures.map((f) => f.feature_name)
        })
      } catch (error) {
        return reply.code(500).send({ error: error.message })
      }
    }
  )
}
// dummy for CodeRabbit

// dummy for CodeRabbit
