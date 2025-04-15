// models/license.js
import { generateLicenseKey } from '../utils/license_helper.js'
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const License = sequelize.define(
  'license',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false }, // 購買者
    pack_id: { type: DataTypes.INTEGER, allowNull: false },
    license_key: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
      defaultValue: generateLicenseKey // ✅ 生成預設 License Key
    }, // ✅ License Key
    purchase_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // ✅ 購買日期
    duration_in_days: { type: DataTypes.INTEGER, allowNull: false }, // ✅ License 可使用天數
    status: {
      type: DataTypes.ENUM('unused', 'activated', 'expired'),
      defaultValue: 'unused',
      index: true
    },
    notes: { type: DataTypes.STRING, allowNull: true }
  },
  { timestamps: false }
)

export default License
