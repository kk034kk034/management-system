// utils/license_helper.js
export function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let key = 'XY' // ✅ 固定前綴
  for (let i = 0; i < 7; i++) {
    let segment = ''
    for (let j = 0; j < 5; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    key += '-' + segment
  }
  return key
}
// dummy for CodeRabbit

// dummy for CodeRabbit
