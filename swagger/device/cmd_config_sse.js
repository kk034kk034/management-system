// swagger/device/sse_keepalive_cache.js
export const getKeepaliveCache = {
  tags: ['Device SSE'],
  summary: 'Retrieve device cache data for a given client_id',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      client_id: {
        type: 'string',
        description: 'The client_id of the device'
      }
    },
    required: ['client_id']
  },
  response: {
    200: {
      description: 'Device data retrieved successfully',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'ok' }
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
// swagger/device/sse_keepalive.js
export const getKeepalive = {
  tags: ['Device SSE'],
  summary: 'Send keepalive signals to devices',
  security: [{ BearerAuth: [] }],
  response: {
    200: {
      description: 'Keepalive signals sent successfully',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'ok' }
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
// swagger/device/sse_device_data.js
export const getDeviceData = {
  tags: ['Device SSE'],
  summary: 'Open an SSE (Server-Sent Events) connection to receive device data',
  security: [{ BearerAuth: [] }],
  response: {
    200: {
      description: 'Successfully opened SSE connection',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'SSE connection opened' }
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
