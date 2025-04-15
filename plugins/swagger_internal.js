// plugins/swagger_internal.js
import FastifyPlugin from 'fastify-plugin'
import FastifySwagger from '@fastify/swagger'
import FastifySwaggerUI from '@fastify/swagger-ui'
import AutoLoad from '@fastify/autoload'
import path from 'node:path'
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()
let internalInstance = null

async function swaggerInternalPlugin(fastify) {
  // Sub-instance encapsulation
  fastify.register(async function (internal) {
    internalInstance = internal

    internal.register(FastifySwagger, {
      openapi: {
        info: {
          title: 'My Fastify API internal',
          description: 'API internal documentation',
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

    internal.register(FastifySwaggerUI, {
      routePrefix: '/internal',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false
      }
    })

    internal.register(AutoLoad, {
      dir: path.join(import.meta.dirname, '../routes/internal'),
      options: {
        prefix: '/api/internal',
        prefixTrailingSlash: 'no-slash'
      }
    })
  })
}

export { internalInstance }
export default FastifyPlugin(swaggerInternalPlugin)
