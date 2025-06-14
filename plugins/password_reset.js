// plugins/password_reset.js
import FastifyPlugin from 'fastify-plugin'
import * as crypto from 'crypto'
import User from '../models/user.js'

async function passwordResetPlugin(fastify) {
  fastify.decorate('requestPasswordReset', async (email) => {
    const existingUser = await User.findOne({ where: { email } })
    if (!existingUser) throw new Error('User does not exist.')

    const resetToken = crypto.randomBytes(32).toString('hex')
    const timestamp = new Date()

    await existingUser.update({
      reset_token: resetToken,
      reset_token_created_at: timestamp
    })

    return { resetToken, timestamp }
  })

  fastify.decorate('resetPassword', async (resetToken, newPassword) => {
    const existingUser = await User.findOne({
      where: { reset_token: resetToken }
    })
    if (!existingUser) throw new Error('Invalid reset request.')

    if (typeof fastify.createPassword !== 'function') {
      throw new Error('createPassword is not available. Make sure passwordPlugin is registered.')
    }

    const hashedPassword = fastify.createPassword(newPassword)
    await existingUser.update({
      password: hashedPassword,
      reset_token: null,
      reset_token_created_at: null
    })

    return 'Password has been successfully reset.'
  })
}

export default FastifyPlugin(passwordResetPlugin)
// dummy for CodeRabbit

// dummy for CodeRabbit
