// plugins/jwt.js
import FastifyPlugin from 'fastify-plugin'
import process from 'node:process'
import dotenv from 'dotenv'

dotenv.config()

var sn = 1

async function jwtAuth(fastify) {
  fastify.register(import('@fastify/jwt'), {
    secret: process.env.JWT_SECRET
  })

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch {
      reply.code(401).send({ error: 'Unauthorized' })
    }
  })

  // generateTokens ensures that accessTokens are valid for 1 hour and refreshTokens are valid for 3 days
  fastify.decorate('generateTokens', function (user) {
    const accessToken = fastify.jwt.sign(
      { id: user.id, sn: sn },
      { expiresIn: '1h', noTimestamp: true, algorithm: 'HS512' }
    )

    const refreshToken = fastify.jwt.sign(
      { id: user.id, sn: sn++ },
      { expiresIn: '3d', noTimestamp: true, algorithm: 'HS512' }
    )

    return { accessToken, refreshToken }
  })

  fastify.decorate('refreshAccessToken', function (user) {
    const accessToken = fastify.jwt.sign(
      { id: user.id, sn: user.sn },
      { expiresIn: '1h', noTimestamp: true, algorithm: 'HS512' }
    )

    return { accessToken }
  })
}

export default FastifyPlugin(jwtAuth)
// dummy for CodeRabbit

// dummy for CodeRabbit
