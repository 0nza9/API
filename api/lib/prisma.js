const { PrismaClient } = require('@prisma/client')

// Client Prisma partagé par toute l'application.
//
// - En PRODUCTION : la base est hébergée sur Turso (libSQL) et on passe par
//   l'adaptateur Prisma. Activé dès que TURSO_DATABASE_URL est défini.
// - En LOCAL : on garde le fichier SQLite classique (DATABASE_URL dans api/.env).
//   Aucun changement pour le développement de tous les jours.

let prisma

if (process.env.TURSO_DATABASE_URL) {
  const { PrismaLibSQL } = require('@prisma/adapter-libsql')
  const adapter = new PrismaLibSQL({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  prisma = new PrismaClient({ adapter })
} else {
  prisma = new PrismaClient()
}

module.exports = prisma
