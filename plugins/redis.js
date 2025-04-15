// plugins/redis.js
import FastifyPlugin from 'fastify-plugin'
import fastifyRedis from '@fastify/redis'
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()

async function redisConnector(fastify) {
  await fastify.register(fastifyRedis, {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379
  })
  fastify.log.info('✅ Redis 連線成功')
}

export default FastifyPlugin(redisConnector)
