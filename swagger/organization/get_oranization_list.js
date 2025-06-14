// swagger/auth/get_organization_list.js
export const getOrganizationList = {
  tags: ['Organization'],
  summary: 'Retrieve the list of accessible organizations for the user',
  security: [{ BearerAuth: [] }],
  response: {
    200: {
      description: 'Successfully retrieved the organization list',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Success' },
        organizations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              organization_id: { type: 'integer', description: '組織 ID' },
              organization_name: {
                type: 'string',
                description: '組織名稱'
              }
            }
          }
        }
      }
    },
    403: {
      description: 'User does not have permission to access organizations',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Permission denied: No access to organizations'
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
