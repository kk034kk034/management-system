// routes/v1/auth/base.js
/**
 * Registration Process -> Forget Password Process -> Login -> Personal Information (Including Change Password)
 */
import { User, UserRole, Organization, Role, UserSession, LoginLog, Site } from '../../../models/index.js'
import process from 'node:process'
import swagger from '../../../swagger/index.js'
import dotenv from 'dotenv'

dotenv.config()

export default async function (fastify) {
  // ✅ create-a-new-user-account flow ==========================================================================
  // Apply for new account and send verification email
  fastify.post('/signup-email', { schema: swagger.signupEmail }, async (request, reply) => {
    try {
      const { username, email, password } = request.body
      const { activationCode, timestamp } = await fastify.requestSignup({
        username,
        email,
        password: await fastify.createPassword(password)
      })

      const verifyLink =
        process.env.URL_BASE + `/api/v1/auth/signup-verify?activation_code=${activationCode}&timestamp=${timestamp}`
      const subject = 'Account Activation - PLANET Cloud NMS'
      const textContent = `Hi ${username},\n\nThank you for registering. Click the link below to verify your email:\n${verifyLink}\n\nThis link is valid for 48 hours.`

      await fastify.sendEmail(email, subject, textContent, null)

      reply.code(200).send({
        message: `The verification letter has been sent to ${email}`
      })
    } catch (error) {
      reply.code(400).send({ error: error.message })
    }
  })

  // Verify Email
  fastify.get('/signup-verify', { schema: swagger.signupVerify }, async (request, reply) => {
    try {
      await fastify.verifySignup(request.query.activation_code, request.query.timestamp)
      reply.code(200).send({ message: 'Email Authentication successful, please log in.' })
    } catch (error) {
      reply.code(400).send({ error: error.message })
    }
  })

  // ✅ forget-password flow ==========================================================================
  // Request password reset
  fastify.post('/password-email', { schema: swagger.passwordEmail }, async (request, reply) => {
    try {
      const { email } = request.body
      const { resetToken, timestamp } = await fastify.requestPasswordReset(email)

      const resetLink = process.env.URL_RESET_PASSWORD + `?reset_token=${resetToken}&timestamp=${timestamp}`
      const subject = 'Password Reset Request - PLANET Cloud NMS'
      const textContent = `Hi,\n\nYou requested a password reset. Click the link below to reset your password:\n${resetLink}\n\nThis link is valid for 10 minutes.`

      await fastify.sendEmail(email, subject, textContent, null)

      reply.code(200).send({ message: `Password reset email has been sent to ${email}` })
    } catch (error) {
      reply.code(400).send({ error: error.message })
    }
  })

  // Verify Token
  fastify.get('/password-verify', { schema: swagger.passwordVerify }, async (request, reply) => {
    try {
      const data = await fastify.verifyResetToken(request.query.reset_token, request.query.timestamp)
      reply.code(200).send(data)
    } catch (error) {
      reply.code(400).send({ error: error.message })
    }
  })

  // Reset password
  fastify.post('/password-reset', { schema: swagger.passwordReset }, async (request, reply) => {
    try {
      const message = await fastify.resetPassword(
        request.body.reset_token,
        fastify.createPassword(request.body.newPassword)
      )
      reply.code(200).send({ message })
    } catch (error) {
      reply.code(400).send({ error: error.message })
    }
  })

  // ✅ login / refresh-token / logout API ==========================================================================
  fastify.post('/login', { schema: swagger.login }, async (request, reply) => {
    const { username, password } = request.body

    // Get IP & User-Agent
    const ipaddr = request.headers['x-forwarded-for'] || request.ip
    const user_agent = request.headers['user-agent'] || 'Unknown'

    // Query `User`
    const foundUser = await User.findOne({ where: { email: username } })
    if (!foundUser) {
      return reply.code(401).send({ error: 'No found this User.' })
    }

    // Verify password
    if (!(await fastify.verifyPassword(password, foundUser.password))) {
      return reply.code(401).send({ error: 'Password error.' })
    }

    // Generate Access Token & Refresh Token
    const { accessToken, refreshToken } = fastify.generateTokens(foundUser)

    // Log successful login
    await LoginLog.create({
      user_id: foundUser.id,
      ipaddr,
      agent: user_agent
    })

    reply.send({ accessToken, refreshToken })
  })

  fastify.post('/refresh-token', { schema: swagger.refreshToken }, async (request, reply) => {
    const { refreshToken } = request.body

    try {
      // Verify Refresh Token
      const decoded = fastify.jwt.verify(refreshToken)

      // Ensure Refresh Token exists in `UserSession`
      const session = await UserSession.findOne({
        where: { refresh_token: refreshToken }
      })
      if (!session) {
        return reply.code(401).send({ error: 'Invalid refresh token' })
      }

      // Generate new Access Token
      const { accessToken } = fastify.refreshAccessToken(decoded)

      reply.send({ accessToken: accessToken })
    } catch {
      return reply.code(401).send({ error: 'Refresh token expired or invalid' })
    }
  })

  fastify.post('/logout', { schema: swagger.logout }, async (request, reply) => {
    const { refreshToken } = request.body

    // Delete session corresponding to refresh token
    const deletedCount = await UserSession.destroy({
      where: { refresh_token: refreshToken }
    })

    if (deletedCount === 0) {
      return reply.code(400).send({ error: 'Invalid refresh token or already logged out.' })
    }

    reply.send({ message: 'Logged out successfully.' })
  })

  // ✅ Obtaining Personal Information ==========================================================================
  fastify.get(
    '/profile',
    {
      schema: swagger.profile,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        // Query `User`, excluding password
        const foundUser = await User.findByPk(request.user.id, {
          attributes: { exclude: ['password'] }
        })

        if (!foundUser) {
          return reply.code(404).send({ error: 'User not found' })
        }

        // Query `Organization` and `Role` that the `User` belongs to
        const userRoles = await UserRole.findAll({
          where: { user_id: foundUser.id },
          include: [
            { model: Role, attributes: ['id', 'name'] },
            { model: Organization, attributes: ['id', 'name'] }
          ]
        })

        if (!userRoles.length) {
          return reply.send({ user: foundUser, organizations: [] })
        }

        // Get all `organization_id`
        const orgIds = userRoles.map((ur) => ur.organization.id)

        // Query `sites` under these `Organizations`
        const sites = await Site.findAll({
          where: { organization_id: orgIds },
          attributes: ['id', 'name', 'organization_id']
        })

        // Organize `organizations` data and attach `sites`
        const organizationData = userRoles.map((ur) => ({
          organization_id: ur.organization.id,
          organization_name: ur.organization.name,
          role_id: ur.role.id,
          role_name: ur.role.name,
          sites: sites
            .filter((site) => site.organization_id === ur.organization.id)
            .map((site) => ({
              site_id: site.id,
              site_name: site.name
            }))
        }))

        return reply.send({ user: foundUser, organizations: organizationData })
      } catch (error) {
        return reply.code(500).send({ message: error.message })
      }
    }
  )
}
// dummy for CodeRabbit

// dummy for CodeRabbit
