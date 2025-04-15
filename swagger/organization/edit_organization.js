// swagger/auth/edit_organization.js
export const editOrganization = {
  tags: ['Organization'],
  summary: 'Edit organization',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      organization_id: { type: 'integer', description: '要編輯的組織 ID' }
    },
    required: ['organization_id']
  },
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        description: '新的組織名稱'
      }
    }
  },
  response: {
    200: {
      description: '組織更新成功',
      type: 'object',
      properties: {
        message: { type: 'string' },
        organization: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            user_id: { type: 'integer' }
          }
        }
      }
    },
    403: {
      description: '無權限編輯',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    404: {
      description: '組織不存在',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
