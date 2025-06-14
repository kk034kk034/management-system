// swagger/organization/delete_organization.js
export const deleteOrganization = {
  tags: ['Organization'],
  summary: 'Delete organization',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      organization_id: { type: 'integer', description: '要刪除的組織 ID' }
    },
    required: ['organization_id']
  },
  response: {
    200: {
      description: '組織及其所有站點成功刪除',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    403: {
      description: '無權限刪除',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    404: {
      description: '組織不存在',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    400: {
      description: '無法刪除，至少需要保留一個組織，或組織內仍有設備',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
