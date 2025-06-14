// swagger/license/get_device_features.js
export const getDeviceFeatures = {
  tags: ['License Management'],
  summary: '查詢設備解鎖的功能',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      device_id: { type: 'integer', description: '設備 ID' }
    },
    required: ['device_id']
  },
  response: {
    200: {
      description: '成功查詢設備解鎖的功能',
      type: 'object',
      properties: {
        device_id: { type: 'integer' },
        unlocked_features: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
