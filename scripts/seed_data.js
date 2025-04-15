// scripts/seed_data.js
import process from 'node:process'
import Role from '../models/role.js'

// ✅ 預設角色資料
async function seedRoles() {
  const roles = [
    { name: 'groupAdmin', type: 'organization', description: '組織擁有者' },
    { name: 'groupManager', type: 'organization', description: '組織管理者' },
    { name: 'groupViewer', type: 'organization', description: '組織瀏覽者' }
  ]

  for (const r of roles) {
    await Role.findOrCreate({ where: { name: r.name }, defaults: r })
  }
  console.log('🎉 Role seed 完成！')
}

// ✅ 執行 `seed` 函數
async function seedData() {
  try {
    await seedRoles()
  } catch (error) {
    console.error('❌ 資料初始化失敗:', error)
  }
}

// 只有手動執行 `node scripts/seedData.js` 時才會執行
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData()
}

export default seedData
