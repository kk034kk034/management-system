// swagger/license/get_device_licenses.js
export const getDeviceLicenses = {
  tags: ['License Management'],
  summary: '查詢設備綁定的 License',
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
      description: '成功查詢設備的 License',
      type: 'object',
      properties: {
        device_id: { type: 'integer' },
        licenses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              license_key: { type: 'string' },
              status: {
                type: 'string',
                enum: ['unused', 'activated', 'expired']
              },
              duration_in_days: { type: 'integer' },
              purchase_date: { type: 'string', format: 'date-time' },
              license_start_date: { type: 'string', format: 'date-time' },
              license_end_date: { type: 'string', format: 'date-time' },
              remaining_days: { type: 'integer' }
            }
          }
        }
      }
    }
  }
}
