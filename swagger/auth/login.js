// swagger/auth/login.js
export const login = {
  tags: ['Authentication'],
  summary: '登入',
  body: {
    type: 'object',
    properties: {
      username: { type: 'string', description: '登入帳號' },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 64,
        description: '登入密碼'
      }
    },
    required: ['username', 'password']
  },
  response: {
    200: {
      description: '登入成功',
      type: 'object',
      properties: {
        accessToken: { type: 'string', description: 'JWT Access Token (1 hr)' },
        refreshToken: {
          type: 'string',
          description: 'JWT Refresh Token (3 days)'
        },
        warning: {
          type: 'string',
          description: '警告訊息，表示尚未有組織角色'
        }
      }
    },
    401: {
      description: '登入失敗',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
