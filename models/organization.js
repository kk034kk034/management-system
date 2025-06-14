// models/organization.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const Organization = sequelize.define(
  'organization',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'name']
      }
    ]
  }
)

export default Organization
// dummy for CodeRabbit

// dummy for CodeRabbit
