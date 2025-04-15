// swagger/organization/create_organization.js
export const createOrganization = {
  tags: ['Organization'],
  summary: '創建組織',
  security: [{ BearerAuth: [] }],
  body: {
    type: 'object',
    properties: {
      organization_name: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        description: '組織名稱'
      },
      site_name: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        description: '組織的預設站點名稱'
      }
    },
    required: ['organization_name', 'site_name']
  },
  response: {
    201: {
      description: '成功創建組織與站點',
      type: 'object',
      properties: {
        message: { type: 'string' },
        organization: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' }
          }
        },
        site: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' }
          }
        }
      }
    },
    400: {
      description: '組織已存在或輸入錯誤',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    500: {
      description: '內部錯誤',
      type: 'object',
      properties: { message: { type: 'string' } }
    }
  }
}
