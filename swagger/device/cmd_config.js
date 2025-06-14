export const getConfigSettings = {
  tags: ['Device CMD'],
  summary: 'Retrieve specific configuration settings for a device',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The client_id of the device'
      },
      name: {
        type: 'string',
        description: 'The name of the configuration setting'
      }
    },
    required: ['id', 'name']
  },
  response: {
    200: {
      description: 'Successfully retrieved configuration setting',
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

export const postConfigCloud = {
  tags: ['Device CMD'],
  summary: 'Send cloud configuration data to a device',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The client_id of the device'
      }
    },
    required: ['id']
  },
  response: {
    200: {
      description: 'Configuration sent successfully',
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
    }
  }
}

export const postConfigReboot = {
  tags: ['Device CMD'],
  summary: 'Send reboot command to a device',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The client_id of the device'
      }
    },
    required: ['id']
  },
  response: {
    200: {
      description: 'Reboot command sent successfully',
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
    }
  }
}

export const postConfigReset = {
  tags: ['Device CMD'],
  summary: 'Send reset command to a device',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The client_id of the device'
      }
    },
    required: ['id']
  },
  response: {
    200: {
      description: 'Reset command sent successfully',
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
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
