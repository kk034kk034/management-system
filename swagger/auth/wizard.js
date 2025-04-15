// swagger/auth/wizard.js
export const wizard = {
  tags: ['Authentication'],
  summary: '建立新的組織與站點（僅限尚未有組織角色的使用者）',
  security: [{ BearerAuth: [] }],
  body: {
    type: 'object',
    required: ['organization_name', 'site_name'],
    properties: {
      organization_name: { type: 'string', description: '組織名稱' },
      site_name: { type: 'string', description: '站點名稱' }
    }
  },
  response: {
    201: {
      description: '初始化完成',
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
      description: '參數錯誤',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    403: {
      description: '已有角色，禁止初始化',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    500: {
      description: '伺服器錯誤',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
