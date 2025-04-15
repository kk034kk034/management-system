// swagger/device/add_device_catalog.js
export const addDeviceCatalog = {
  tags: ['Device'],
  summary: 'Add a new device catalog',
  security: [{ BearerAuth: [] }],
  body: {
    type: 'object',
    properties: {
      macaddr: {
        type: 'string',
        description: 'MAC address'
      },
      serial_number: {
        type: 'string',
        description: 'Serial number'
      },
      modelname: {
        type: 'string',
        description: 'Model name of the device'
      }
    },
    required: ['serial_number', 'modelname']
  },
  response: {
    201: {
      description: 'Device added successfully',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Device added successfully' },
        device: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            macaddr: {
              type: 'string',
              nullable: true,
              example: '00:11:22:33:44:55'
            },
            serial_number: { type: 'string', example: 'SN000001' },
            modelname: { type: 'string', example: 'LS100' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    400: {
      description: 'Duplicate serial number or MAC address',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Duplicate entry: Serial number or MAC address already exists'
        }
      }
    },
    403: {
      description: 'Permission denied',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Permission denied' }
      }
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal Server Error' }
      }
    }
  }
}
