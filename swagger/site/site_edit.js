// swagger/site/site_edit.js
export const updateSite = {
  tags: ['Site'],
  summary: 'Update an existing site',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      site_id: { type: 'integer' }
    },
    required: ['site_id']
  },
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' }
    }
  },
  response: {
    200: {
      description: 'Successfully updated the site',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Site updated' },
        site: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 123 },
            organization_id: { type: 'integer', example: 3036 },
            user_id: { type: 'integer', example: 1001 },
            name: { type: 'string', example: 'Updated Office' },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-11-28T15:28:33.000Z'
            }
          }
        }
      }
    },
    403: {
      description: 'User does not have permission to update this site',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Permission denied' }
      }
    },
    404: {
      description: 'Site not found',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Site not found' }
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
