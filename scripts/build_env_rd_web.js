// scripts/build_env_rd_web.js
import fs from 'fs'
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()

const config = {
  URL_BASE: process.env.URL_BASE
}

const content = `window.env = ${JSON.stringify(config, null, 2)};`

fs.writeFileSync('./public_rd/env.js', content)
console.log('✅ env.js generated')
