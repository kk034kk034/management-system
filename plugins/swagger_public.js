// plugins/swagger_public.js
import FastifyPlugin from 'fastify-plugin'
import FastifySwagger from '@fastify/swagger'
import FastifySwaggerUI from '@fastify/swagger-ui'
import AutoLoad from '@fastify/autoload'
import path from 'node:path'
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()
let v1Instance = null

async function swaggerV1Plugin(fastify) {
  // Sub-instance encapsulation
  fastify.register(async function (v1) {
    v1Instance = v1

    v1.register(FastifySwagger, {
      openapi: {
        info: {
          title: 'My Fastify API v1',
          description: 'API v1 documentation',
          version: '1.0.0'
        },
        servers: [{ url: `${process.env.URL_BASE}` }],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      },
      stripBasePath: true
    })

    v1.register(FastifySwaggerUI, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false
      }
    })

    v1.register(AutoLoad, {
      dir: path.join(import.meta.dirname, '../routes/v1'),
      options: {
        prefix: '/api/v1',
        prefixTrailingSlash: 'no-slash'
      }
    })
  })
}

export { v1Instance }
export default FastifyPlugin(swaggerV1Plugin)
