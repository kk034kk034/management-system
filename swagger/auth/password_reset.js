// swagger/auth/password_reset.js
export const passwordReset = {
  tags: ['Authentication'],
  summary: '重設密碼',
  body: {
    type: 'object',
    properties: {
      reset_token: { type: 'string', description: '重設密碼的 Token' },
      newPassword: { type: 'string', minLength: 8, description: '新密碼' }
    },
    required: ['reset_token', 'newPassword']
  },
  response: {
    200: {
      description: '密碼重設成功',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    400: {
      description: '錯誤請求',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
