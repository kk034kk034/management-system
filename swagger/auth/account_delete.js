// swagger/auth/accountDelete.js
export const accountDelete = {
  tags: ['Authentication'],
  summary: '刪除帳戶',
  security: [{ BearerAuth: [] }],
  response: {
    200: {
      description: '帳戶刪除成功',
      type: 'object',
      properties: {
        message: { type: 'string', description: '刪除成功的訊息' }
      }
    },
    400: {
      description: '請求錯誤',
      type: 'object',
      properties: {
        error: { type: 'string', description: '錯誤訊息' }
      }
    },
    404: {
      description: '找不到使用者',
      type: 'object',
      properties: {
        error: { type: 'string', description: '錯誤訊息' }
      }
    },
    500: {
      description: '伺服器錯誤',
      type: 'object',
      properties: {
        error: { type: 'string', description: '錯誤訊息' }
      }
    }
  }
}
