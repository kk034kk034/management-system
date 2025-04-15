// plugins/sequelize.js
import FastifyPlugin from 'fastify-plugin'
import process from 'node:process'
import { Sequelize } from 'sequelize'
import mysql from 'mysql2/promise' // Used to ensure that the database exists
import dotenv from 'dotenv'

dotenv.config()

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env

// First check and create database
async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  })
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  )
  await connection.end()
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false
})

async function dbConnector(fastify) {
  try {
    await ensureDatabaseExists()
    await sequelize.authenticate()
    console.log('✅ MySQL connection successful')

    await import('../models/index.js') // Load all models here

    await sequelize.sync({ alter: false }) // Prevent Sequelize from attempting to modify table structure
    console.log('✅ Table synchronization complete')

    console.log('🔄 Initializing default data...')
    const { default: seedData } = await import('../scripts/seed_data.js')
    await seedData()
    const { default: seedPack } = await import('../scripts/seed_pack.js')
    await seedPack()
    const { default: seedPackFeat } = await import('../scripts/seed_pack_feature.js')
    await seedPackFeat()
    console.log('✅ Default data initialization complete')
  } catch (error) {
    console.error('❌ Unable to connect to MySQL:', error)
  }

  fastify.decorate('sequelize', sequelize)
}

export { sequelize }
export default FastifyPlugin(dbConnector)
