// swagger/auth/user_role_add.js
export const createUserRole = {
  tags: ['User Management'],
  summary: '新增使用者角色',
  security: [{ BearerAuth: [] }],
  body: {
    type: 'object',
    properties: {
      target_email: {
        type: 'string',
        format: 'email',
        description: '目標用戶 Email'
      },
      role_id: { type: 'integer', description: '角色 ID' }
    },
    required: ['target_email', 'role_id']
  },
  params: {
    type: 'object',
    properties: {
      organization_id: { type: 'integer', description: '組織 ID' }
    },
    required: ['organization_id']
  },
  response: {
    200: {
      description: '成功新增使用者角色',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    400: {
      description: '請求無效，例如使用者已擁有該角色',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    404: {
      description: '找不到目標對象',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
