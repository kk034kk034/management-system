// swagger/site/site_delete.js
export const deleteSite = {
  tags: ['Site'],
  summary: 'Delete a site',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      site_id: { type: 'integer' }
    },
    required: ['site_id']
  },
  response: {
    200: {
      description: 'Successfully deleted the site',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Site deleted' }
      }
    },
    400: {
      description: '無法刪除，至少需要保留一個站點，或站點內仍有設備',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    403: {
      description: 'User does not have permission to delete this site',
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
