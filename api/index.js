const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const route = require('./routes/index')
const app = express()

// GET    Voir tous les avis (public, autorisés uniquement)
// GET    Voir un avis
// GET    File de modération (admin)
// POST   Publier un avis (public)
// PATCH  Modifier un avis (admin)
// PUT    Autoriser un avis (admin)
// DELETE Supprimer un avis (admin)
// POST   Register / Login / Logout / Forgot / Reset

// CORS restreint : seule l'origine du front-end est autorisée (CORS_ORIGIN),
// et credentials:true pour que le cookie de session httpOnly soit accepté.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

app.use('/', route)

// 404 pour toute route inconnue.
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' })
})

// Middleware d'erreur centralisé (A5) : un seul endroit gère les erreurs,
// aucune stack trace n'est renvoyée au client.
app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({ message: 'Erreur serveur' })
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
