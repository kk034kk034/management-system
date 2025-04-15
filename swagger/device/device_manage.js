// swagger/devices/update_device_config.js
export const updateDeviceConfig = {
  tags: ['Device Management'],
  summary: 'Update device `site_id` and optionally `organization_id`',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      device_id: {
        type: 'integer',
        description: 'The ID of the device to be updated'
      }
    },
    required: ['device_id']
  },
  body: {
    type: 'object',
    properties: {
      new_site_id: {
        type: 'integer',
        description: 'The new site_id for the device'
      },
      new_organization_id: {
        type: 'integer',
        description: 'The new organization_id for the device (only owner can modify)'
      }
    },
    required: ['new_site_id']
  },
  response: {
    200: {
      description: 'Device configuration updated successfully',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Device configuration updated successfully'
        },
        device: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 74128 },
            site_id: { type: 'integer', example: 999 },
            organization_id: { type: 'integer', example: 3049 }
          }
        }
      }
    },
    400: {
      description: 'Invalid request parameters',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'new_site_id is required' }
      }
    },
    403: {
      description: 'Permission denied',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'You do not have permission to update this device'
        }
      }
    },
    404: {
      description: 'Device not found',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Device not found or access denied' }
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
