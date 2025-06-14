// swagger/site/get_devices.js
export const getDevicesBySite = {
  tags: ['Site'],
  summary: '根據 site_id 取得該站點內的所有設備',
  security: [{ BearerAuth: [] }],
  params: {
    type: 'object',
    properties: {
      site_id: { type: 'integer', description: '站點 ID' }
    },
    required: ['site_id']
  },
  response: {
    200: {
      description: '成功取得站點內的設備',
      type: 'object',
      properties: {
        message: { type: 'string' },
        devices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              // ✅ DeviceBind 資料
              id: { type: 'integer', example: 74128 },
              user_id: { type: 'integer', example: 123 },
              organization_id: { type: 'integer', example: 3036 },
              site_id: { type: 'integer', example: 593 },
              client_id: {
                type: 'string',
                example: '8c4acabb86d745959be798188c434419'
              },
              type: { type: 'integer', example: 0 },
              snmp_type: { type: 'integer', example: 7 },
              macaddr: { type: 'string', example: 'a8:f7:e0:00:22:02' },
              serial_number: { type: 'string', example: 'SN000001' },
              modelname: { type: 'string', example: 'WDAP-C3000AX' },
              fwver: { type: 'string', example: 'v2.0.0' },
              api: { type: 'integer', example: 1 },
              appview: { type: 'integer', example: 0 },
              logintime: {
                type: 'string',
                format: 'date-time',
                example: '2024-11-28T15:28:33.000Z'
              },
              name: { type: 'string', example: 'Device A' },
              description: {
                type: 'string',
                nullable: true,
                example: 'Test device'
              },
              latitude: { type: 'number', nullable: true, example: 25.1234 },
              longitude: { type: 'number', nullable: true, example: 121.5678 },
              altitude: { type: 'number', nullable: true, example: 50.75 },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-11-28T15:28:33.000Z'
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-11-30T02:41:47.000Z'
              }
            }
          }
        }
      }
    },
    403: {
      description: '無權存取該站點',
      type: 'object',
      properties: { error: { type: 'string' } }
    },
    404: {
      description: '站點不存在',
      type: 'object',
      properties: { error: { type: 'string' } }
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
