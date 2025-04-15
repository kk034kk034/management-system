// swagger/auth/get_sites.js
export const getOrganizationSites = {
  tags: ['Organization'],
  summary: 'Get all sites under a specific organization',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      organization_id: { type: 'integer', description: 'Organization ID' }
    },
    required: ['organization_id']
  },
  response: {
    200: {
      description: 'List of sites under the organization',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Success' },
        sites: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              site_id: { type: 'integer', example: 123 },
              site_name: { type: 'string', example: 'Main Office' }
            }
          }
        }
      }
    },
    403: {
      description: 'User does not have permission to access this organization',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Permission denied: No access to view sites in this organization'
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
