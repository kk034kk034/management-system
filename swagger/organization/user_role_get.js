// swagger/auth/user_role_get.js
export const getUserRoles = {
  tags: ['User Management'],
  summary: '取得指定組織的使用者角色',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      organization_id: { type: 'integer', description: '組織 ID' }
    },
    required: ['organization_id']
  },
  response: {
    200: {
      description: '成功取得該組織內的使用者角色列表',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user_id: { type: 'integer', description: '使用者 ID' },
          name: { type: 'string', description: '使用者名稱' },
          email: {
            type: 'string',
            format: 'email',
            description: '使用者 Email'
          },
          role_id: { type: 'integer', description: '角色 ID' },
          role_name: {
            type: 'string',
            description: '角色名稱（從 roles 表獲取）'
          },
          role_description: {
            type: 'string',
            description: '角色描述（從 roles 表獲取）'
          },
          last_access_datetime: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            description: '最後登入時間 (user_sessions.created_at)'
          },
          create_datetime: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            description: '角色變更時間 (role_change_logs.changed_at)'
          }
        }
      }
    },
    403: {
      description: '權限不足',
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
