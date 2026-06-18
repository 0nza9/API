const argon2 = require('argon2')

// Hash a plain-text password before storing it.
const hashPassword = (password) => argon2.hash(password)

// Compare a plain-text password against a stored hash.
// Returns true when they match, false otherwise.
const verifyPassword = (hash, password) => argon2.verify(hash, password)

module.exports = { hashPassword, verifyPassword }
