// swagger/devices/deleteDevice.js
export const deleteDevice = {
  tags: ['Device Management'],
  summary: '刪除裝置',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      device_id: { type: 'integer', description: '裝置 ID' }
    },
    required: ['device_id']
  },
  response: {
    200: {
      description: '裝置刪除成功',
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
    403: {
      description: '無權限',
      type: 'object',
      properties: {
        error: { type: 'string', description: '錯誤訊息' }
      }
    },
    404: {
      description: '找不到裝置',
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
