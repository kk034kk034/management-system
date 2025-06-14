// swagger/devices/add_device.js
export const addDevice = {
  tags: ['Device Management'],
  summary: 'Add a new device',
  security: [{ BearerAuth: [] }],
  body: {
    type: 'object',
    properties: {
      pincode: {
        type: 'string',
        nullable: true,
        description: 'PIN CODE (optional)'
      },
      organization_id: {
        type: 'integer',
        description: 'The organization ID to which the device belongs'
      },
      site_id: {
        type: 'integer',
        description: 'Site ID'
      },
      macaddr: {
        type: 'string',
        description: 'MAC address of the device'
      },
      serial_number: {
        type: 'string',
        description: 'Serial number of the device'
      },
      name: {
        type: 'string',
        nullable: true,
        description: 'Device name (optional)'
      }
    },
    required: ['organization_id', 'site_id', 'macaddr', 'serial_number']
  },
  response: {
    200: {
      description: 'Device added successfully',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Device added successfully' },
        device: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 12345 },
            user_id: { type: 'integer', example: 1 },
            organization_id: { type: 'integer', example: 1 },
            site_id: { type: 'integer', example: 1 },
            macaddr: { type: 'string', example: 'a8:f7:e0:00:3f:01' },
            serial_number: { type: 'string', example: 'SN1234567890ab' },
            name: { type: 'string', example: 'Test Device' }
          }
        }
      }
    },
    400: {
      description: 'Missing required fields',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'macaddr and serial_number are required'
        }
      }
    },
    403: {
      description: 'Permission denied',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Permission denied: Cannot add device to this organization'
        }
      }
    },
    404: {
      description: 'Not found',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'cannot find device'
        }
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
// dummy for CodeRabbit

// dummy for CodeRabbit
