// plugins/sso_google.js
import FastifyPlugin from 'fastify-plugin'
import process from 'node:process'
import fastifyOAuth2 from '@fastify/oauth2'
import dotenv from 'dotenv'
import { User, UserRole, Organization, Site } from '../models/index.js'

dotenv.config()

async function googleAuth(fastify) {
  fastify.register(fastifyOAuth2, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET
      },
      auth: fastifyOAuth2.GOOGLE_CONFIGURATION
    },
    startRedirectPath: '/api/v1/auth/google',
    callbackUri: process.env.URL_BASE + process.env.GOOGLE_REDIRECT_URI
  })

  // Google SSO Callback
  fastify.get('/api/v1/auth/google/callback', async (request, reply) => {
    try {
      const { token } = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token.access_token}` }
      }).then((res) => res.json())

      const { email, name } = userInfo

      // Query user
      let user = await User.findOne({
        where: { email }
      })

      // If user doesn't exist, perform registration
      if (!user) {
        user = await registerUserFromSSO(fastify, email, name)
      }

      // Generate Fastify JWT
      const { accessToken, refreshToken } = fastify.generateTokens(user)

      // return reply.send({ accessToken, refreshToken })
      return reply.redirect(`${process.env.URL_SSO_CALLBACK}?accessToken=${accessToken}&refreshToken=${refreshToken}`)
    } catch (error) {
      fastify.log.error('Google SSO 錯誤:', error)
      return reply.code(500).send({ error: 'Google SSO 登入失敗' })
    }
  })
}

// Google SSO registration process (like verifySignup)
async function registerUserFromSSO(fastify, email, username) {
  const newUser = await User.create({
    email,
    username,
    password: 'google-sso-no-password' // Google doesn't give out passwords.
  })

  const defaultOrg = await Organization.create({
    user_id: newUser.id,
    name: 'default'
  })

  await Site.create({
    organization_id: defaultOrg.id,
    name: 'default'
  })

  await UserRole.create({
    user_id: newUser.id,
    organization_id: defaultOrg.id,
    role_id: 1 // TODO: Default Role
  })

  return newUser
}

export default FastifyPlugin(googleAuth)
