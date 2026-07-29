const crypto = require('crypto')
const users = require('../repositories/users.repo')

const RESET_TTL_MS = 60 * 60 * 1000 // le lien expire au bout d'1 heure

// POST /forgot-password — démarrer une réinitialisation de mot de passe.
// email est déjà validé par post.middleware.forgot-password.js
module.exports = async (req, res) => {
  const { email } = req.body || {}

  // Réponse générique : on ne révèle jamais si l'email existe ou non.
  const response = {
    message:
      'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.',
  }

  try {
    const user = await users.findByEmail(email)
    if (user) {
      const token = crypto.randomBytes(24).toString('hex')
      const expiresAt = new Date(Date.now() + RESET_TTL_MS).toISOString()
      await users.setReset(user.id, token, expiresAt)
      // En production, ce token serait envoyé par email. Ici (projet sans service
      // d'email), on le renvoie directement pour pouvoir tester le flux.
      response.resetToken = token
    }

    res.json(response)
  } catch (err) {
    console.error('forgot-password error:', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
