// plugins/multipart.js
import fp from 'fastify-plugin'
import multipart from '@fastify/multipart'

export default fp(async (fastify) => {
  fastify.register(multipart, {
    attachFieldsToBody: false // Default is false, can be omitted. If added, explicitly indicates it will be used in the preview section
  })
})
