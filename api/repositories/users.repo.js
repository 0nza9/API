const prisma = require('../lib/prisma')

// User data access, backed by the local SQLite database via Prisma.
// Same interface as before, but every function is now async (returns a Promise),
// so callers must `await` them.

const normalizeEmail = (email) => String(email).trim().toLowerCase()

function findByEmail(email) {
  return prisma.user.findUnique({ where: { email: normalizeEmail(email) } })
}

async function findByToken(token) {
  if (!token) return null
  const row = await prisma.authToken.findUnique({
    where: { token },
    include: { user: true },
  })
  if (!row) return null
  // Reject (and clean up) expired sessions.
  if (row.expiresAt.getTime() < Date.now()) {
    await prisma.authToken.delete({ where: { token } }).catch(() => {})
    return null
  }
  return row.user
}

function findByResetToken(token) {
  if (!token) return null
  return prisma.user.findFirst({ where: { resetToken: token } })
}

function create({ email, passwordHash }) {
  return prisma.user.create({
    data: { email: normalizeEmail(email), passwordHash },
  })
}

function addToken(id, token, expiresAt) {
  return prisma.authToken.create({ data: { token, userId: id, expiresAt } })
}

function removeToken(id, token) {
  return prisma.authToken.deleteMany({ where: { token, userId: id } })
}

function setReset(id, token, expiresAt) {
  return prisma.user.update({
    where: { id },
    data: { resetToken: token, resetExpires: new Date(expiresAt) },
  })
}

function updatePassword(id, passwordHash) {
  // Apply the new password, consume the reset token, and invalidate every
  // existing session — all in one transaction.
  return prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: { passwordHash, resetToken: null, resetExpires: null },
    }),
    prisma.authToken.deleteMany({ where: { userId: id } }),
  ])
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
