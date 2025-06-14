// utils/others.js

export function cleanSwaggerTrailingSlash(swaggerInstance) {
  try {
    if (typeof swaggerInstance.swagger === 'function') {
      const rawPaths = swaggerInstance.swagger().paths
      if (rawPaths) {
        swaggerInstance.swagger().paths = Object.fromEntries(
          Object.entries(rawPaths).map(([key, value]) => [key.replace(/\/$/, ''), value])
        )
        console.log('✅ Swagger trailing slashes cleaned')
      }
    } else {
      console.warn('⚠️ swaggerInstance.swagger is not a function')
    }
  } catch (err) {
    console.warn('⚠️ Failed to clean Swagger paths:', err)
  }
}

export function convertCloudTypeToSNMPType(type) {
  const map = {
    1: 1,
    2: 9,
    3: 1,
    4: 9,
    5: 1,
    6: 4,
    7: 6,
    8: 2,
    9: 16
  }
  return map[type] || 0
}

export function convertSNMPTypeToCloudType(snmp_type) {
  const map = {
    1: 1, // Prefer to convert to 1
    2: 8,
    4: 6,
    6: 7,
    9: 2, // Prefer to convert to 2
    16: 9
  }
  return map[snmp_type] || 0 // Convert others to 0
}
// dummy for CodeRabbit

// dummy for CodeRabbit
