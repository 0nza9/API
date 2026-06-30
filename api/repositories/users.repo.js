const fs = require('fs')
const path = require('path')

// Fake "database": a JSON file, same pattern as reviews.repo.js.
// All user data access goes through this module.
const DATA_DIR = path.join(__dirname, '..', 'data')
const DATA_FILE = path.join(DATA_DIR, 'users.json')

function read() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return [] // file missing or empty/corrupt -> start fresh
  }
}

function write(users) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2))
}

function nextId(users) {
  return users.reduce((max, u) => Math.max(max, u.id), 0) + 1
}

function findByEmail(email) {
  const target = String(email).trim().toLowerCase()
  return read().find((u) => u.email === target) || null
}

function findByToken(token) {
  if (!token) return null
  return (
    read().find(
      (u) => Array.isArray(u.authTokens) && u.authTokens.includes(token),
    ) || null
  )
}

function findByResetToken(token) {
  if (!token) return null
  return read().find((u) => u.reset && u.reset.token === token) || null
}

function create({ email, passwordHash }) {
  const users = read()
  const user = {
    id: nextId(users),
    email: String(email).trim().toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
    authTokens: [], // active login tokens
    reset: null, // { token, expiresAt } when a reset is pending
  }
  users.push(user)
  write(users)
  return user
}

// --- mutations on an existing user (found by id) ---
function mutate(id, fn) {
  const users = read()
  const user = users.find((u) => u.id === id)
  if (!user) return null
  fn(user)
  write(users)
  return user
}

function addToken(id, token) {
  return mutate(id, (u) => {
    u.authTokens = u.authTokens || []
    u.authTokens.push(token)
  })
}

function removeToken(id, token) {
  return mutate(id, (u) => {
    u.authTokens = (u.authTokens || []).filter((t) => t !== token)
  })
}

function setReset(id, token, expiresAt) {
  return mutate(id, (u) => {
    u.reset = { token, expiresAt }
  })
}

function updatePassword(id, passwordHash) {
  return mutate(id, (u) => {
    u.passwordHash = passwordHash
    u.reset = null // consume the reset token
    u.authTokens = [] // force re-login everywhere
  })
}

module.exports = {
  findByEmail,
  findByToken,
  findByResetToken,
  create,
  addToken,
  removeToken,
  setReset,
  updatePassword,
}
