// swagger/license/bind_license.js
export const bindLicense = {
  tags: ['License Management'],
  summary: '綁定 License 到設備',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      device_id: { type: 'integer', description: '設備 ID' }
    },
    required: ['device_id']
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
      description: '成功綁定 License',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
}
