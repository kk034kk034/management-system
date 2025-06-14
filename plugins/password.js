// plugins/password.js
import FastifyPlugin from 'fastify-plugin'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

async function createPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

async function verifyPassword(password, storedHash) {
  return await bcrypt.compare(password, storedHash)
}

async function passwordPlugin(fastify) {
  fastify.decorate('createPassword', createPassword)
  fastify.decorate('verifyPassword', verifyPassword)
}

export { createPassword, verifyPassword }
export default FastifyPlugin(passwordPlugin)
// dummy for CodeRabbit

// dummy for CodeRabbit
