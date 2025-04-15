// swagger/auth/user_role_history.js
export const roleHistory = {
  tags: ['User Management'],
  summary: '查詢使用者角色變更記錄',
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
      description: '角色變更紀錄列表',
      type: 'object',
      properties: {
        history: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              organization_id: { type: 'integer' },
              changed_by_user_id: { type: 'integer' },
              target_user_id: { type: 'integer' },
              old_role_id: { type: 'integer' },
              new_role_id: { type: 'integer' },
              changed_at: {
                type: 'string',
                format: 'date-time',
                description: '變更時間'
              }
            }
          }
        }
      }
    }
  }
}
