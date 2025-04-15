// swagger/device/device_preview_json.js
export const checkOneDevice = {
  description: 'Check a single device before adding',
  tags: ['Device Management'],
  summary: 'Check one device availability',
  body: {
    type: 'object',
    required: ['macaddr', 'serial_number'],
    properties: {
      macaddr: { type: 'string' },
      serial_number: { type: 'string' },
      pincode: {
        type: 'string',
        description: 'Optional device pincode',
        default: '12345678'
      }
    }
  },
  response: {
    200: {
      description: 'Device is valid and available',
      type: 'object',
      properties: {
        message: { type: 'string' },
        macaddr: { type: 'string' },
        serial_number: { type: 'string' },
        modelname: { type: 'string' }
      }
    },
    400: {
      description: 'Device is already bound',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    404: {
      description: 'Device not found in catalog',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
}
