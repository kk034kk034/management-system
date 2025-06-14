// scripts/seed_pack_feature.js
import process from 'node:process'
import Pack from '../models/pack.js'
import PackFeature from '../models/pack_feature.js'
import { sequelize } from '../plugins/sequelize.js'

const seedPackFeatures = async () => {
  await sequelize.sync()

  // TODO: 因應未來變動，所以要先清空然後再寫入
  await PackFeature.destroy({ where: {}, truncate: true })

  const featureMap = {
    'base-pack': ['dashboard', 'devices', 'map-floor', 'topology'],
    'plus-pack': ['summary-report', 'monitor', 'configure'],
    'pro-pack': ['clients', 'application-usage'],
    'switch-pack': [],
    'ap-pack': [],
    'firewall-pack': [],
    'gateway-pack': [],
    'routers-pack': []
  }

  for (const [packType, features] of Object.entries(featureMap)) {
    const foundPack = await Pack.findOne({ where: { pack_type: packType } })

    if (foundPack) {
      for (const feature of features) {
        await PackFeature.create({
          pack_id: foundPack.id,
          feature_name: feature
        })
      }
    }
  }

  console.log('🎉 Pack Feature seed 完成！')
}

// ✅ 允許手動運行 `node scripts/seed_pack_feature.js`
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPackFeatures().then(() => process.exit())
}

export default seedPackFeatures
// dummy for CodeRabbit

// dummy for CodeRabbit
