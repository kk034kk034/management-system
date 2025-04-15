// models/pack.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const Pack = sequelize.define(
  'pack',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pack_type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      index: true
    }, // 例如 'base-pack', 'plus-pack', 'pro-pack', 'switch-pack', 'ap-pack', 'firewall-pack', 'gateway-pack', 'routers-pack'
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  { timestamps: false }
)

export default Pack
