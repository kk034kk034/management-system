// models/user_role.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const UserRole = sequelize.define(
  'user_role',
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
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    site_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: false
  }
)

export default UserRole
// dummy for CodeRabbit

// dummy for CodeRabbit
