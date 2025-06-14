// models/pack_feature.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const PackFeature = sequelize.define(
  'pack_feature',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pack_id: { type: DataTypes.INTEGER, allowNull: false },
    feature_name: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true
    } // 例如 `advanced-dashboard`, `iot-control`
  },
  { timestamps: false }
)
export default PackFeature
// dummy for CodeRabbit

// dummy for CodeRabbit
