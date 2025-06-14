// swagger/auth/refresh_token.js
export const refreshToken = {
  tags: ['Authentication'],
  summary: '刷新 Access Token',
  description: '使用 Refresh Token 來獲取新的 Access Token，避免使用者需要重新登入。',
  body: {
    type: 'object',
    properties: {
      refreshToken: { type: 'string', description: 'JWT Refresh Token' }
    },
    required: ['refreshToken']
  },
  response: {
    200: {
      description: '刷新成功，返回新的 Access Token',
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: '新的 JWT Access Token (1 小時有效)'
        }
      }
    },
    401: {
      description: 'Refresh Token 過期或無效',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
