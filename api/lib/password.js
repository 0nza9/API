const crypto = require('crypto')

// Password hashing with Node's built-in crypto (scrypt) — no extra dependency.
// A stored hash looks like "<salt>:<derivedKey>", both in hex.

function hash(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

function verify(password, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false
  const [salt, derived] = stored.split(':')
  const known = Buffer.from(derived, 'hex')
  const test = crypto.scryptSync(password, salt, 64)
  // Constant-time compare to avoid timing attacks.
  return known.length === test.length && crypto.timingSafeEqual(known, test)
}

module.exports = { hash, verify }
