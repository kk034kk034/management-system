// swagger/license/get_user_licenses.js
export const getUserLicenses = {
  tags: ['License Management'],
  summary: '查詢用戶擁有的 License',
  security: [{ BearerAuth: [] }],
  response: {
    200: {
      description: 'License 列表',
      type: 'object',
      properties: {
        licenses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              license_key: { type: 'string' },
              pack_id: { type: 'integer' },
              duration_in_days: { type: 'integer' },
              status: {
                type: 'string',
                enum: ['unused', 'activated', 'expired']
              },
              purchase_date: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }
}
