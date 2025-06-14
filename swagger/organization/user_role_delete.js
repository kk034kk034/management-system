// swagger/auth/user_role_delete.js
export const deleteUserRole = {
  tags: ['User Management'],
  summary: '刪除組織內的使用者角色',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      organization_id: { type: 'integer', description: '組織 ID' },
      user_id: { type: 'integer', description: '要刪除的使用者 ID' }
    },
    required: ['organization_id', 'user_id']
  },
  response: {
    200: {
      description: '成功刪除使用者角色',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    403: {
      description: '權限不足',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    404: {
      description: '使用者或組織未找到',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    500: {
      description: '內部伺服器錯誤',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
