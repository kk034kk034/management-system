// swagger/auth/signup_email.js
export const signupEmail = {
  tags: ['Authentication'],
  summary: '發送註冊驗證信',
  body: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        description: '使用者名稱'
      },
      email: { type: 'string', format: 'email', description: '使用者 Email' },
      password: { type: 'string', minLength: 8, description: '密碼' }
    },
    required: ['username', 'email', 'password']
  },
  response: {
    200: {
      description: '驗證信已發送',
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
