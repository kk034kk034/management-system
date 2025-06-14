// utils/validate_device_excel.js
import { DeviceCatalog, DeviceBind } from '../models/index.js'
import { Op } from 'sequelize'
import ExcelJS from 'exceljs'

export async function parseExcelDevices(buffer) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)

  const sheet = workbook.getWorksheet('Template')
  if (!sheet) {
    throw new Error('Worksheet "Template" not found')
  }

  const records = []
  for (let rowIdx = 3; rowIdx <= 102; rowIdx++) {
    const row = sheet.getRow(rowIdx)
    const mac = row.getCell(1).text.trim()
    const serial = row.getCell(2).text.trim()
    if (!mac && !serial) continue

    records.push({
      mac_address: mac,
      serial_number: serial,
      name: row.getCell(3).text.trim() || mac,
      description: row.getCell(4).text.trim(),
      latitude: row.getCell(5).text.trim(),
      longitude: row.getCell(6).text.trim(),
      altitude: row.getCell(7).text.trim()
    })
  }

  return records
}

export async function validateDeviceRecords(records) {
  const devicePairs = records.map((d) => ({
    macaddr: d.mac_address,
    serial_number: d.serial_number
  }))

  // 型錄驗證
  const catalogs = await DeviceCatalog.findAll({
    where: { [Op.or]: devicePairs }
  })
  const catalogSet = new Set(catalogs.map((d) => `${d.macaddr}::${d.serial_number}`))

  const invalid = records.filter((r) => !catalogSet.has(`${r.mac_address}::${r.serial_number}`))
  if (invalid.length > 0) {
    return { error: 'There are unsupported devices', invalid }
  }

  // 綁定驗證
  const alreadyBound = await DeviceBind.findAll({
    where: { [Op.or]: devicePairs },
    attributes: ['macaddr', 'serial_number']
  })
  const boundSet = new Set(alreadyBound.map((d) => `${d.macaddr}::${d.serial_number}`))
  const duplicates = records.filter((r) => boundSet.has(`${r.mac_address}::${r.serial_number}`))
  if (duplicates.length > 0) {
    return {
      error: 'Some of the devices have been bound',
      already_bound: duplicates
    }
  }

  return { ok: true }
}
// dummy for CodeRabbit

// dummy for CodeRabbit
