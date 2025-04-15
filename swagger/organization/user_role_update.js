// swagger/auth/user_role_update.js
export const updateUserRole = {
  tags: ['User Management'],
  summary: '變更使用者角色',
  security: [{ BearerAuth: [] }],
  body: {
    type: 'object',
    properties: {
      new_role_id: { type: 'integer', description: '新的角色 ID' }
    },
    required: ['new_role_id']
  },
  params: {
    type: 'object',
    properties: {
      organization_id: { type: 'integer', description: '組織 ID' },
      user_id: { type: 'integer', description: '要變更的使用者 ID' }
    },
    required: ['organization_id', 'user_id']
  },
  response: {
    200: {
      description: '成功變更使用者角色',
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
