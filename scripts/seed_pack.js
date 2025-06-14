// scripts/seed_pack.js
import process from 'node:process'
import Pack from '../models/pack.js'
import { sequelize } from '../plugins/sequelize.js'

const seedPacks = async () => {
  await sequelize.sync() // 確保資料庫連線

  const packs = [
    { pack_type: 'base-pack', description: '基本方案' },
    { pack_type: 'plus-pack', description: '進階方案' },
    { pack_type: 'pro-pack', description: '專業方案' },
    { pack_type: 'switch-pack', description: '交換機管理方案' },
    { pack_type: 'ap-pack', description: '無線AP方案' },
    { pack_type: 'firewall-pack', description: '防火牆方案' },
    { pack_type: 'gateway-pack', description: '閘道器方案' },
    { pack_type: 'routers-pack', description: '路由器方案' }
  ]

  for (const p of packs) {
    await Pack.findOrCreate({
      where: { pack_type: p.pack_type },
      defaults: p
    })
  }

  console.log('🎉 Pack seed 完成！')
}

// ✅ 允許手動運行 `node scripts/seed_pack.js`
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPacks().then(() => process.exit())
}

export default seedPacks
// dummy for CodeRabbit

// dummy for CodeRabbit
