// swagger/organization/trans_org_owner.js
export const transferOwnership = {
  tags: ['Organization'],
  summary: 'Transfer ownership of an organization',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    required: ['organization_id'],
    properties: {
      organization_id: {
        type: 'integer',
        description: 'ID of the organization to transfer ownership of'
      }
    }
  },
  body: {
    type: 'object',
    required: ['new_owner_user_id'],
    properties: {
      new_owner_user_id: {
        type: 'integer',
        description: 'User ID of the new owner'
      }
    }
  },
  response: {
    200: {
      description: 'Ownership transferred successfully',
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Ownership transferred successfully'
        }
      }
    },
    400: {
      description: 'Bad Request',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Cannot transfer ownership to yourself'
        }
      }
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Only groupAdmin can transfer ownership'
        }
      }
    },
    404: {
      description: 'Target user not found in this organization',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Target user not found in this organization'
        }
      }
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Internal Server Error' }
      }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
