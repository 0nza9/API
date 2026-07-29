// Seed de développement : crée un compte administrateur et quelques avis.
// Lancer avec : npm run db:seed   (depuis le dossier api/)
const prisma = require('../lib/prisma')
const passwords = require('../lib/password')

const ADMIN_EMAIL = 'admin@mds-avis.fr'
const ADMIN_PASSWORD = 'admin1234'

async function main() {
  // Compte admin (idempotent : ne recrée pas s'il existe déjà).
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { isAdmin: true },
    create: {
      email: ADMIN_EMAIL,
      passwordHash: passwords.hash(ADMIN_PASSWORD),
      isAdmin: true,
    },
  })

  // Quelques avis de démonstration, seulement si la table est vide.
  const count = await prisma.avis.count()
  if (count === 0) {
    await prisma.avis.createMany({
      data: [
        { author: 'Alice', description: 'Excellent service, je recommande vivement !', rating: 5, authorized: true },
        { author: 'Bob', description: 'Très bon rapport qualité-prix.', rating: 4, authorized: true },
        { author: 'Charlie', description: 'Correct, mais peut être amélioré.', rating: 3, authorized: false },
      ],
    })
  }

  console.log(`Seed OK — admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
