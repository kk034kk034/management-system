// models/device_catalog.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const DeviceCatalog = sequelize.define(
  'device_catalog',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    macaddr: {
      // 有些情況: 沒有MAC、MAC相同、變更MAC --> 所以允許空值且不唯一
      type: DataTypes.STRING,
      allowNull: true
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false
  }
)

export default DeviceCatalog
// dummy for CodeRabbit

// dummy for CodeRabbit
