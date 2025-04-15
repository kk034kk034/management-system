// models/device_bind.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const DeviceBind = sequelize.define(
  'device_bind',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    site_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    snmp_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    macaddr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fwver: {
      type: DataTypes.STRING,
      allowNull: true
    },
    api: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    appview: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    logintime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true
    },
    altitude: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: true
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

export default DeviceBind
