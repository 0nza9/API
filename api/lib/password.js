const bcrypt = require('bcryptjs')

// Password hashing with bcrypt (adaptive, salted). The cost factor controls how
// slow — and therefore how brute-force-resistant — hashing is. 10 ≈ good default.
const COST = 10

// Hash a plain-text password before storing it. Returns a self-contained string
// that already embeds the salt and cost (e.g. "$2a$10$...").
function hash(password) {
  return bcrypt.hashSync(password, COST)
}

// Compare a plain-text password against a stored bcrypt hash. Constant-time.
function verify(password, stored) {
  if (typeof stored !== 'string') return false
  try {
    return bcrypt.compareSync(password, stored)
  } catch {
    return false
  }
}

module.exports = { hash, verify }
