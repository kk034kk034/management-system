// models/site.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const Site = sequelize.define(
  'site',
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  { timestamps: false }
)

export default Site
