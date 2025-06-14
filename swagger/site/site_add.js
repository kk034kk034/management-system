// swagger/site/site_add.js
export const createSite = {
  tags: ['Site'],
  summary: 'Create a new site',
  security: [{ BearerAuth: [] }],
  body: {
    type: 'object',
    required: ['name', 'organization_id'],
    properties: {
      name: { type: 'string' },
      organization_id: { type: 'integer' }
    }
  },
  response: {
    201: {
      description: 'Successfully created the site',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Site created' },
        site: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 123 },
            organization_id: { type: 'integer', example: 3036 },
            user_id: { type: 'integer', example: 1001 },
            name: { type: 'string', example: 'Main Office' },
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
      description: 'User does not have permission to create a site',
      type: 'object',
      properties: {
        error: { type: 'string', example: 'Permission denied' }
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
