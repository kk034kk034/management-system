// models/mqtt_log.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const MqttLog = sequelize.define(
  'mqtt_log',
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
    client_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      // config_unbind, device_error, ...
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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

export default MqttLog
// dummy for CodeRabbit

// dummy for CodeRabbit
