// models/login_log.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const LoginLog = sequelize.define(
  'login_log',
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
    logintime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    ipaddr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    agent: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
)

export default LoginLog
