// swagger/license//buy_license.js
export const buyLicense = {
  tags: ['License Management'],
  summary: '購買 License',
  security: [{ BearerAuth: [] }],
  body: {
    type: 'object',
    required: ['pack_id', 'quantity', 'duration_in_days'],
    properties: {
      pack_id: { type: 'integer', description: '方案 ID' },
      quantity: { type: 'integer', description: '購買數量' },
      duration_in_days: { type: 'integer', description: '使用天數' }
    }
  },
  response: {
    200: {
      description: '成功購買 License',
      type: 'object',
      properties: {
        message: { type: 'string' },
        licenses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              user_id: { type: 'integer' },
              pack_id: { type: 'integer' },
              duration_in_days: { type: 'integer' },
              status: {
                type: 'string',
                enum: ['unused', 'activated', 'expired']
              },
              license_key: { type: 'string' },
              purchase_date: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
