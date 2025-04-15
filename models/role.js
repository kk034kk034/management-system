// models/role.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const Role = sequelize.define(
  'role',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('organization', 'site'),
      allowNull: false,
      defaultValue: 'organization'
    },
    description: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  }
)

export default Role
