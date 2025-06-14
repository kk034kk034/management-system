// utils/pin_code_loader.js
import fs from 'node:fs/promises'
import path from 'node:path'

const jsonPath = path.resolve('./utils/pin_code_map.json')

export async function loadPinCodeMap() {
  try {
    const content = await fs.readFile(jsonPath, 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    console.error('❌ 無法讀取 pinCode map:', err)
    return {}
  }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
