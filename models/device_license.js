// models/device_license.js
/**
 * 1️⃣ 當 License 綁定到裝置時：
 * device_license.license_end_date = device_license.license_start_date + device_license.remaining_days
 * （初次綁定時，remaining_days = license.duration_in_days）
 * 2️⃣ 當 License 轉移到另一台裝置時：
 * device_license.remaining_days = device_license.remaining_days - (轉移當天 - device_license.license_start_date)
 * （計算剩餘天數）
 * 3️⃣ 在新裝置上：
 * device_license.license_end_date = device_license.license_start_date + device_license.remaining_days
 * （新裝置的到期時間基於剩餘天數重新計算）
 */
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const DeviceLicense = sequelize.define(
  'device_license',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    device_id: { type: DataTypes.INTEGER, allowNull: false }, // 綁定的裝置
    license_id: { type: DataTypes.INTEGER, allowNull: false }, // License
    license_start_date: { type: DataTypes.DATE, allowNull: false }, // License 啟用時間
    license_end_date: { type: DataTypes.DATE, allowNull: false }, // 到期時間（轉移時可累加）
    remaining_days: { type: DataTypes.INTEGER, allowNull: false }, // ✅ 記錄剩餘天數，綁定啟用的時候remaining_days=license.duration_in_days
    license_transfer_count: { type: DataTypes.INTEGER, defaultValue: 0 } // ✅ 轉移次數
  },
  { timestamps: false }
)

export default DeviceLicense
