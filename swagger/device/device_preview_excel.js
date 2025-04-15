// swagger/device/device_add_bulk_preview.js
export const bulkUploadPreview = {
  description: 'Previewing device data in an Excel file',
  tags: ['Device Management'],
  summary: 'Preview Excel Device List',
  consumes: ['multipart/form-data'],
  params: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: '上傳 Excel 檔案（範本格式）'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        count: { type: 'integer' },
        devices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              mac_address: { type: 'string' },
              serial_number: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              latitude: { type: 'string' },
              longitude: { type: 'string' },
              altitude: { type: 'string' }
            }
          }
        }
      }
    },
    400: {
      description: 'Device validation failure (unsupported or bound)',
      type: 'object',
      properties: {
        error: { type: 'string' },
        invalid: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              mac_address: { type: 'string' },
              serial_number: { type: 'string' }
            }
          }
        },
        already_bound: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              mac_address: { type: 'string' },
              serial_number: { type: 'string' }
            }
          }
        }
      }
    },
    406: {
      description: 'Request multipart/form-data',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
}
