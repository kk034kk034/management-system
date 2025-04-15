// swagger/auth/password_verify.js
export const passwordVerify = {
  tags: ['Authentication'],
  summary: '驗證密碼重設 Token',
  querystring: {
    type: 'object',
    properties: {
      reset_token: { type: 'string', description: '用於驗證的密碼重設 Token' },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Token 產生時間'
      }
    },
    required: ['reset_token', 'timestamp']
  },
  response: {
    200: {
      description: 'Token 驗證成功',
      type: 'object',
      properties: {
        message: { type: 'string', description: '驗證成功訊息' }
      }
    },
    400: {
      description: '錯誤請求',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
