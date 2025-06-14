// routes/v1/site/base.js
/**
 * 創建 Site ---------------------> groupAdmin, groupManager
 * 編輯 Site ---------------------> groupAdmin, groupManager
 * 刪除 Site ---------------------> groupAdmin, groupManager
 * 透過 site_id 取得所有 DeviceBind ---> groupAdmin, groupManager, groupViewer
 */
import { DeviceBind, Site } from '../../../models/index.js'
import swagger from '../../../swagger/index.js'
import { getOrgIdFromSite } from '../../../utils/permissions.js'

export default async function (fastify) {
  // ✅ 創建站點
  fastify.post(
    '/',
    {
      schema: swagger.createSite,
      preValidation: [fastify.authenticate],
      preHandler: [
        fastify.authorize('createAny', 'site', (req) => ({
          organization_id: req.body.organization_id
        }))
      ]
    },
    async (request, reply) => {
      try {
        const { name, organization_id } = request.body

        const newSite = await Site.create({
          name,
          organization_id
        })

        return reply.code(201).send({ message: 'Site created', site: newSite })
      } catch (error) {
        return reply.code(500).send({ message: error.message })
      }
    }
  )

  // ✅ 更新站點
  fastify.put(
    '/:site_id',
    {
      schema: swagger.updateSite,
      preValidation: [fastify.authenticate],
      preHandler: [fastify.authorize('updateAny', 'site', getOrgIdFromSite)]
    },
    async (request, reply) => {
      try {
        const { site_id } = request.params
        const { name } = request.body

        const siteRecord = await Site.findByPk(site_id)
        if (!siteRecord) {
          return reply.code(404).send({ error: 'Site not found' })
        }

        await siteRecord.update({ name })

        return reply.send({ message: 'Site updated', site: siteRecord })
      } catch (error) {
        return reply.code(500).send({ message: error.message })
      }
    }
  )

  // ✅ 刪除站點
  fastify.delete(
    '/:site_id',
    {
      schema: swagger.deleteSite,
      preValidation: [fastify.authenticate],
      preHandler: [fastify.authorize('deleteAny', 'site', getOrgIdFromSite)]
    },
    async (request, reply) => {
      try {
        const { site_id } = request.params

        const siteRecord = await Site.findByPk(site_id)
        if (!siteRecord) {
          return reply.code(404).send({ error: 'Site not found' })
        }

        // 確保該 `organization` 內沒有裝置
        const deviceCount = await DeviceBind.count({ where: { site_id } })
        if (deviceCount > 0) {
          return reply.code(400).send({
            error: 'Cannot delete Site with existing devices'
          })
        }

        // nebula可以把site刪光

        await siteRecord.destroy()

        return reply.send({ message: 'Site deleted' })
      } catch (error) {
        return reply.code(500).send({ message: error.message })
      }
    }
  )

  // ✅ 透過 site_id 取得所有 DeviceBind
  fastify.get(
    '/:site_id/devices',
    {
      schema: swagger.getDevicesBySite,
      preValidation: [fastify.authenticate],
      preHandler: [fastify.authorize('readAny', 'device', getOrgIdFromSite)]
    },
    async (request, reply) => {
      try {
        const { site_id } = request.params

        // 查詢該站點的設備
        const devices = await DeviceBind.findAll({
          where: { site_id }
        })

        // 轉換回應格式
        const formattedDevices = devices.map((device) => device.get())

        return reply.send({ message: 'ok', devices: formattedDevices })
      } catch (error) {
        return reply.code(500).send({ message: error.message })
      }
    }
  )
}
// dummy for CodeRabbit

// dummy for CodeRabbit
