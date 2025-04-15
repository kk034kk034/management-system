// models/user.js
import { DataTypes } from 'sequelize'
import { sequelize } from '../plugins/sequelize.js'

const User = sequelize.define(
  'user',
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
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    system_role: {
      type: DataTypes.ENUM('sysAdmin', 'sysTester', 'sysUser', 'sysCircle', 'sysDemo'),
      allowNull: false,
      defaultValue: 'sysUser'
    },
    reset_token: {
      // ✅ 存放重置密碼的 Token
      type: DataTypes.STRING,
      allowNull: true
    },
    reset_token_created_at: {
      // ✅ 記錄 Token 產生時間
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: true, // ✅ 讓 Sequelize 自動管理 createdAt 和 updatedAt
    createdAt: 'created_at', // ✅ 自動設定 created_at
    updatedAt: 'updated_at' // ✅ 自動設定 updated_at
  }
)

export default User
