const prisma = require('../lib/prisma')

// Review ("avis") data access, backed by SQLite via Prisma.
// Every function is async (returns a Promise), so callers must `await` them.

// Public list: only authorized reviews, newest first.
function getPublic() {
  return prisma.avis.findMany({
    where: { authorized: true },
    orderBy: { createdAt: 'desc' },
  })
}

// Admin list: everything, including reviews awaiting moderation.
function getAll() {
  return prisma.avis.findMany({ orderBy: { createdAt: 'desc' } })
}

function getById(id) {
  return prisma.avis.findUnique({ where: { id: Number(id) } })
}

function create({ author, email, description, rating }) {
  return prisma.avis.create({
    data: { author, email: email || null, description, rating },
  })
}

// Partial update (edit content / rating). Returns null if the review is gone.
async function update(id, data) {
  try {
    return await prisma.avis.update({ where: { id: Number(id) }, data })
  } catch {
    return null // record not found
  }
}

function authorize(id) {
  return update(id, { authorized: true })
}

async function remove(id) {
  try {
    await prisma.avis.delete({ where: { id: Number(id) } })
    return true
  } catch {
    return false // record not found
  }
}

module.exports = { getPublic, getAll, getById, create, update, authorize, remove }
