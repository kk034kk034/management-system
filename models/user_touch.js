// models/user_touch.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const UserTouch = sequelize.define(
  'user_touch',
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
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    touchtime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
)

export default UserTouch
// dummy for CodeRabbit

// dummy for CodeRabbit
