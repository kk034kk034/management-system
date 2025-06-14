// swagger/device/add_device_bulk.js
export const bulkUploadDevices = {
  tags: ['Device Management'],
  summary: 'Bulk binding devices via Excel',
  description:
    'Upload an Excel (.xlsx) file to bind multiple devices in batch. Required fields: organization_id, site_id, and Excel file with macaddr & serial_number',
  security: [{ BearerAuth: [] }],
  consumes: ['multipart/form-data'],
  params: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: '上傳 Excel 檔案（.xlsx）'
      },
      organization_id: {
        type: 'integer',
        description: '組織 ID（必填）'
      },
      site_id: {
        type: 'integer',
        description: '站點 ID（必填）'
      }
    }
  },
  response: {
    200: {
      description: 'Bulk upload results',
      type: 'object',
      properties: {
        message: { type: 'string' },
        count: { type: 'integer' }
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
// dummy for CodeRabbit

// dummy for CodeRabbit
