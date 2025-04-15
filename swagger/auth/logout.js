// swagger/auth/logout.js
export const logout = {
  tags: ['Authentication'],
  summary: '登出',
  description: '登出並刪除 Refresh Token，確保 session 失效。',
  body: {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string',
        description: 'JWT Refresh Token，登出時提供以刪除 session'
      }
    },
    required: ['refreshToken']
  },
  response: {
    200: {
      description: '登出成功',
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully.' }
      }
    },
    400: {
      description: '無效的 Refresh Token 或已登出',
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Invalid refresh token or already logged out.'
        }
      }
    }
  }
}
