// models/users_not_verified.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const UsersNotVerified = sequelize.define(
  'users_not_verified',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activation_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false
  }
)

export default UsersNotVerified
// dummy for CodeRabbit

// dummy for CodeRabbit
