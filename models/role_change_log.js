// models/role_change_log.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const RoleChangeLog = sequelize.define(
  'role_change_log',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    changed_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    target_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    old_role_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    new_role_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    changed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false
  }
)

export default RoleChangeLog
