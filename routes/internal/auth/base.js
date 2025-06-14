// routes/internal/auth/base.js
import { User, UserRole, Organization, UserSession, RoleChangeLog } from '../../../models/index.js'
import { Op } from 'sequelize'
import swagger from '../../../swagger/index.js'
import dotenv from 'dotenv'

dotenv.config()

export default async function (fastify) {
  // ✅ 刪除帳戶 ==========================================================================
  fastify.delete(
    '/account-delete',
    {
      schema: swagger.accountDelete,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        const userId = request.user.id

        // 確保該用戶存在
        const foundUser = await User.findByPk(userId)
        if (!foundUser) {
          return reply.code(404).send({ error: 'User not found' })
        }

        // 刪除 UserSession
        await UserSession.destroy({ where: { user_id: userId } })

        // 刪除 RoleChangeLog (目標用戶或變更者)
        await RoleChangeLog.destroy({
          where: {
            [Op.or]: [{ target_user_id: userId }, { changed_by_user_id: userId }]
          }
        })

        // 刪除 UserRole
        await UserRole.destroy({ where: { user_id: userId } })

        // 刪除該用戶擁有的 organization（同時影響 user_role）
        await Organization.destroy({ where: { user_id: userId } })

        // 最後刪除 User 本體
        await User.destroy({ where: { id: userId } })

        reply.send({ message: 'Account deleted successfully' })
      } catch (error) {
        reply.code(500).send({ error: error.message })
      }
    }
  )
}
// dummy for CodeRabbit

// dummy for CodeRabbit
