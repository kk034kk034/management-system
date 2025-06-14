// swagger/auth/signup_verify.js
export const signupVerify = {
  tags: ['Authentication'],
  summary: '驗證 Email',
  querystring: {
    type: 'object',
    properties: {
      activation_code: { type: 'string', description: '用戶的 Email 驗證碼' },
      timestamp: {
        type: 'integer',
        description: '時間戳 (UNIX Timestamp, 毫秒級)'
      }
    },
    required: ['activation_code', 'timestamp']
  },
  response: {
    200: {
      description: '驗證成功',
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object', description: '已驗證的用戶資訊' }
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
