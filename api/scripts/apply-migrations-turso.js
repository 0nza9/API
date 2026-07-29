// Applique les migrations Prisma à la base Turso, SANS la CLI Turso.
// Utilise @libsql/client (déjà installé) pour exécuter chaque migration.sql.
//
// À lancer UNE FOIS sur une base Turso vide, avec les variables d'environnement
// définies dans le terminal :
//   $env:TURSO_DATABASE_URL="libsql://..."
//   $env:TURSO_AUTH_TOKEN="..."
//   npm run db:turso:migrate
const fs = require('fs')
const path = require('path')
const { createClient } = require('@libsql/client')

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) {
  console.error('❌ Définissez TURSO_DATABASE_URL et TURSO_AUTH_TOKEN avant de lancer ce script.')
  process.exit(1)
}

const client = createClient({ url, authToken })
const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations')

async function main() {
  // Les dossiers de migration commencent par un timestamp : tri = ordre chronologique.
  const dirs = fs
    .readdirSync(migrationsDir)
    .filter((d) => fs.existsSync(path.join(migrationsDir, d, 'migration.sql')))
    .sort()

  if (dirs.length === 0) {
    console.error('Aucune migration trouvée.')
    process.exit(1)
  }

  for (const d of dirs) {
    const sql = fs.readFileSync(path.join(migrationsDir, d, 'migration.sql'), 'utf8')
    process.stdout.write(`→ ${d} ... `)
    await client.executeMultiple(sql)
    console.log('OK')
  }

  console.log('✅ Schéma appliqué à Turso. Lancez maintenant : npm run db:seed')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('\n❌', e.message || e)
    process.exit(1)
  })
