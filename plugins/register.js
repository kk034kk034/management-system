// plugins/register.js
import FastifyPlugin from 'fastify-plugin'
import * as crypto from 'crypto'
import { User, UsersNotVerified, UserRole, Organization } from '../models/index.js'

async function registerPlugin(fastify) {
  fastify.decorate('requestSignup', async ({ username, email, password }) => {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) throw new Error('Email 已經註冊')

    const activationCode = crypto.randomBytes(32).toString('hex')
    const timestamp = Date.now()

    await UsersNotVerified.destroy({ where: { email } })

    if (typeof fastify.createPassword !== 'function') {
      throw new Error('createPassword is not available. Make sure passwordPlugin is registered.')
    }

    const hashedPassword = password

    await UsersNotVerified.create({
      username,
      email,
      password: hashedPassword,
      activation_code: activationCode,
      created_at: new Date(timestamp)
    })

    return { activationCode, timestamp }
  })

  fastify.decorate('verifySignup', async (activationCode) => {
    const userToVerify = await UsersNotVerified.findOne({
      where: { activation_code: activationCode }
    })
    if (!userToVerify) throw new Error('驗證碼無效或已過期')

    const existingUser = await User.findOne({
      where: { email: userToVerify.email }
    })
    if (existingUser) throw new Error('Email 已經驗證，請直接登入')

    const newUser = await User.create({
      username: userToVerify.username,
      email: userToVerify.email,
      password: userToVerify.password
    })

    const newOrganization = await Organization.create({
      user_id: newUser.id,
      name: 'default'
    })

    await UserRole.create({
      user_id: newUser.id,
      organization_id: newOrganization.id,
      role_id: 1
    })

    await userToVerify.destroy()

    return { success: true }
  })
}

export default FastifyPlugin(registerPlugin)
// dummy for CodeRabbit

// dummy for CodeRabbit
