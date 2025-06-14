// swagger/device/add_device_bulk_template.js
export const bulkUploadTemplate = {
  tags: ['Device Management'],
  summary: 'Download Excel template for bulk upload',
  description:
    'Download an Excel template with correct columns for bulk upload. `macaddr` and `serial_number` are required when uploading.',
  response: {
    200: {
      description: 'Excel template file (.xlsx)',
      type: 'string',
      format: 'binary'
    }
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
