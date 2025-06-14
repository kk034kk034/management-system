// swagger/auth/password_email.js
export const passwordEmail = {
  tags: ['Authentication'],
  summary: '申請密碼重設',
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: '用戶註冊的 Email'
      }
    },
    required: ['email']
  },
  response: {
    200: {
      description: '申請信已發送',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    400: {
      description: '請求錯誤',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
