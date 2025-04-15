export const getStatsClients = {
  tags: ['Device CMD'],
  summary: 'Retrieve client statistics for a specific device and radio interface',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The client_id of the device' },
      radioName: { type: 'string', description: 'The radio interface name' },
      vapIndex: { type: 'integer', description: 'The VAP index' }
    },
    required: ['id', 'radioName', 'vapIndex']
  },
  querystring: {
    type: 'object',
    properties: {
      sn: {
        type: 'string',
        description: 'Serial number for verification (optional)'
      }
    }
  },
  response: {
    200: {
      description: 'Successfully retrieved client statistics',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'ok' }
      }
    },
    403: {
      description: 'User is not authorized to access this device',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Forbidden' }
      }
    },
    404: {
      description: 'Device not found',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Device not found' }
      }
    }
  }
}

export const getStatsViewer = {
  tags: ['Device CMD'],
  summary: 'Retrieve overall statistics for a specific device',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'The client_id of the device' }
    },
    required: ['id']
  },
  response: {
    200: {
      description: 'Successfully retrieved device statistics',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'ok' }
      }
    },
    403: {
      description: 'User is not authorized to access this device',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Forbidden' }
      }
    },
    404: {
      description: 'Device not found',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Device not found' }
      }
    }
  }
}
