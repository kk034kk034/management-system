// routes/v1/devices/base.js
/**
 * 取得 該 User 底下 所有 Organization ----> groupAdmin, groupManager, groupViewer
 * 創建 Organization ---------------------> groupAdmin
 * 編輯 Organization ---------------------> groupAdmin, groupManager
 * 刪除 Organization ---------------------> groupAdmin
 * 取得 該 Organization 底下 所有 sites ---> groupAdmin, groupManager, groupViewer
 * 取得 該 Organization 底下 所有 devices -> groupAdmin, groupManager, groupViewer
 */
import { UserRole, Organization, Role, DeviceBind, Site, RoleChangeLog } from '../../../models/index.js'
import swagger from '../../../swagger/index.js'
import { getOrgId } from '../../../utils/permissions.js'
import { Op } from 'sequelize'

export default async function (fastify) {
  // ✅ 取得該 `用戶` 底下的所有 `組織`
  fastify.get(
    '/',
    {
      schema: swagger.getOrganizationList,
      preValidation: [fastify.authenticate],
      preHandler: [fastify.authorize('readAny', 'organization')]
    },
    async (request, reply) => {
      try {
        const userId = request.user.id

        // 取得使用者所屬的 `organization_id`
        const userRoles = await UserRole.findAll({
          where: { user_id: userId },
          attributes: ['organization_id']
        })
        if (!userRoles.length) {
          return reply.code(403).send({ error: 'Permission denied: No access to organizations' })
        }
        const userOrganizations = userRoles.map((ur) => ur.organization_id)

        // 取得這些組織 🔄 返回id, name就好
        const organizations = await Organization.findAll({
          where: { id: userOrganizations },
          attributes: [
            ['id', 'organization_id'],
            ['name', 'organization_name']
          ]
        })

        return reply.send({ message: 'Success', organizations })
      } catch (error) {
        return reply.code(500).send({ message: error.message })
      }
    }
  )

  // 新增
  fastify.post(
    '/',
    {
      schema: swagger.createOrganization,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        const { organization_name, site_name } = request.body
        const user_id = request.user.id

        // 檢查必填欄位
        if (!organization_name || !site_name) {
          return reply.code(400).send({ error: 'Organization name and Site name are required' })
        }

        // 確保 `organization_name` 在 `user_id` 內是唯一的
        const existingOrg = await Organization.findOne({
          where: { user_id, name: organization_name }
        })
        if (existingOrg) {
          return reply.code(400).send({
            error: 'The User already has an Organization with the same name'
          })
        }

        // 確認 DB.Role 含 `groupAdmin`
        const foundRole = await Role.findOne({
          where: { name: 'groupAdmin' }
        })
        if (!foundRole) {
          return reply.code(500).send({ error: 'The groupAdmin Role could not be found' })
        }

        // 創建 `Organization`
        const newOrg = await Organization.create({
          user_id,
          name: organization_name
        })

        // 創建 `Site`
        const newSite = await Site.create({
          name: site_name,
          organization_id: newOrg.id
        })

        // 在 `UserRole` 表中記錄 `groupAdmin`
        await UserRole.create({
          user_id,
          organization_id: newOrg.id,
          role_id: foundRole.id
        })

        reply.code(201).send({
          message: 'Organization created',
          organization: {
            id: newOrg.id,
            name: newOrg.name
          },
          site: {
            id: newSite.id,
            name: newSite.name
          }
        })
      } catch (error) {
        return reply.code(500).send({ message: error.message })
      }
    }
  )

  // 編輯
  fastify.put(
    '/:organization_id',
    {
      schema: swagger.editOrganization,
      preValidation: [fastify.authenticate],
      preHandler: [fastify.authorize('updateAny', 'organization', getOrgId)]
    },
    async (request, reply) => {
      try {
        const { organization_id } = request.params
        const { name } = request.body

        // 🔍 1. 確保 `Organization` 存在
        const foundOrg = await Organization.findByPk(organization_id)
        if (!foundOrg) {
          return reply.code(404).send({ error: 'Organization not found' })
        }

        // 🔍 2. 查出此 org 擁有者的 user_id
        const ownerUserId = foundOrg.user_id

        // 🔍 3. 確認此 user 擁有的其他 org 是否重名
        const existingOrg = await Organization.findOne({
          where: {
            user_id: ownerUserId, // ✅ 查擁有者的 org
            name, // ✅ 看有無重名
            id: { [Op.ne]: organization_id } // ✅ 排除自己
          }
        })
        if (existingOrg) {
          return reply.code(400).send({
            error: 'This user already has an organization with the same name'
          })
        }

        // ✅ 4. 通過檢查，更新名稱
        foundOrg.name = name
        await foundOrg.save()

        reply.send({ message: 'ok', organization: foundOrg })
      } catch (error) {
        console.error('❌ 更新組織發生錯誤:', error)
        reply.code(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  fastify.put(
    '/:organization_id/transfer-ownership',
    {
      schema: swagger.transferOwnership,
      preValidation: [fastify.authenticate],
      preHandler: [fastify.authorize('updateAny', 'userRole', getOrgId)]
    },
    async (request, reply) => {
      try {
        const { organization_id } = request.params
        const { new_owner_user_id } = request.body
        const current_user_id = request.user.id

        if (String(new_owner_user_id) === String(current_user_id)) {
          return reply.code(400).send({ error: 'Cannot transfer ownership to yourself' })
        }

        // 🔍 1. 確保 `Organization` 存在
        const foundOrg = await Organization.findByPk(organization_id)
        if (!foundOrg) {
          return reply.code(404).send({ error: 'Organization not found' })
        }

        // 取得角色資訊
        const [groupAdminRole, groupManagerRole] = await Promise.all([
          Role.findOne({ where: { name: 'groupAdmin' } }),
          Role.findOne({ where: { name: 'groupManager' } })
        ])
        if (!groupAdminRole || !groupManagerRole) return reply.code(500).send({ error: 'Role definitions missing' })

        // ✅ 查操作者是否在此 org 是 groupAdmin
        const operatorUserRole = await UserRole.findOne({
          where: {
            user_id: current_user_id,
            organization_id,
            role_id: groupAdminRole.id
          }
        })
        if (!operatorUserRole) {
          return reply.code(403).send({ error: 'Only groupAdmin can transfer ownership' })
        }

        // ✅ 查新擁有者是否也在此 org
        const targetUserRole = await UserRole.findOne({
          where: {
            user_id: new_owner_user_id,
            organization_id
          }
        })
        if (!targetUserRole) {
          return reply.code(404).send({ error: 'Target user not found in this organization' })
        }

        // update Organization owner
        foundOrg.update({ user_id: new_owner_user_id })

        // ✅ 將對方設為 groupAdmin
        targetUserRole.update({ role_id: groupAdminRole.id })
        RoleChangeLog.create({
          organization_id,
          changed_by_user_id: current_user_id,
          target_user_id: new_owner_user_id,
          old_role_id: targetUserRole.role_id,
          new_role_id: groupAdminRole.id
        })

        // ✅ 自己降級為 groupManager
        operatorUserRole.update({ role_id: groupManagerRole.id })
        RoleChangeLog.create({
          organization_id,
          changed_by_user_id: current_user_id,
          target_user_id: current_user_id,
          old_role_id: groupAdminRole.id,
          new_role_id: groupManagerRole.id
        })

        return reply.send({ message: 'Ownership transferred successfully' })
      } catch (err) {
        console.error('❌ Ownership Transfer Error:', err)
        return reply.code(500).send({ error: 'Internal Server Error' })
      }
    }
  )

  // 刪除
  fastify.delete(
    '/:organization_id',
    {
      schema: swagger.deleteOrganization,
      preValidation: [fastify.authenticate],
      preHandler: [fastify.authorize('deleteAny', 'organization', getOrgId)]
    },
    async (request, reply) => {
      const { organization_id } = request.params

      const foundOrg = await Organization.findByPk(organization_id)
      if (!foundOrg) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      // 🔍 檢查該組織內是否還有設備，不能刪除仍有設備的組織
      const deviceCount = await DeviceBind.count({ where: { organization_id } })
      if (deviceCount > 0) {
        return reply.code(400).send({
          error: 'Cannot delete Organization with existing devices'
        })
      }

      // 🔍 檢查該組織內是否還有 Site，不能刪除仍有 Site 的組織
      const siteCount = await Site.count({ where: { organization_id } })
      if (siteCount > 0) {
        return reply.code(400).send({
          error: 'Cannot delete Organization with existing sites'
        })
      }

      // 刪除該組織相關資料(Site, UserRole, and DeviceBind)
      await RoleChangeLog.destroy({ where: { organization_id } })
      await foundOrg.destroy()

      reply.send({ message: 'ok' })
    }
  )

  // ✅ 取得該 `組織` 底下的 `站點`
  fastify.get(
    '/:organization_id/sites',
    {
      schema: swagger.getOrganizationSites,
      preValidation: [fastify.authenticate],
      preHandler: [fastify.authorize('readAny', 'site', getOrgId)]
    },
    async (request, reply) => {
      try {
        const { organization_id } = request.params

        const sites = await Site.findAll({
          where: { organization_id },
          attributes: [
            ['id', 'site_id'],
            ['name', 'site_name']
          ]
        })

        return reply.send({ message: 'Success', sites })
      } catch (error) {
        return reply.code(500).send({ message: error.message })
      }
    }
  )

  // ✅ 取得該 `組織` 底下的 `裝置`
  fastify.get(
    '/:organization_id/devices',
    {
      schema: swagger.getOrganizationDevices,
      preValidation: [fastify.authenticate],
      preHandler: [fastify.authorize('readAny', 'device', getOrgId)]
    },
    async (request, reply) => {
      try {
        const { organization_id } = request.params

        // 查詢該組織的設備
        const devices = await DeviceBind.findAll({
          where: { organization_id }
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
