// routes/internal/device/base.js
/**
 * sysAdmin
 * create DeviceCatalog (catalog)------------> groupAdmin, groupManager
 */
import { DeviceCatalog } from '../../../models/index.js'
import swagger from '../../../swagger/index.js'

export default async function (fastify) {
  // ✅ addnew device_catalog
  fastify.post(
    '/',
    {
      schema: swagger.addDeviceCatalog,
      preValidation: [fastify.authenticate]
    },
    async (request, reply) => {
      try {
        const { macaddr, serial_number, modelname } = request.body
        // check users.system_role, must be sysAdmin can addnew device_catalog
        if (request.user.system_role !== 'sysAdmin') {
          return reply.code(403).send({ error: 'Permission denied' })
        }

        const newDevice = await DeviceCatalog.create({
          macaddr: macaddr || null,
          serial_number,
          modelname
        })

        return reply.code(201).send({
          message: 'Device added successfully',
          device: newDevice
        })
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return reply.code(400).send({
            message: 'Duplicate entry: Serial number or MAC address already exists'
          })
        }
        return reply.code(500).send({ message: error.message })
      }
    }
  )
}
// dummy for CodeRabbit

// dummy for CodeRabbit
