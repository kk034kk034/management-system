// swagger/license/transfer_license.js
export const transferLicense = {
  tags: ['License Management'],
  summary: '轉移 License 到其他設備',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      from_device_id: { type: 'integer', description: '來源設備 ID' },
      to_device_id: { type: 'integer', description: '目標設備 ID' }
    },
    required: ['from_device_id', 'to_device_id']
  },
  body: {
    type: 'object',
    required: ['license_id'],
    properties: {
      license_id: { type: 'integer', description: 'License ID' }
    }
  },
  response: {
    200: {
      description: '成功轉移 License',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
