const users = require('../repositories/users.repo')
const passwords = require('../lib/password')

// POST /reset-password — appliquer un nouveau mot de passe via un token.
// token + password sont déjà validés par post.middleware.reset-password.js
module.exports = async (req, res) => {
  const { token, password } = req.body || {}

  try {
    const user = await users.findByResetToken(token)

    const expired =
      user && user.resetExpires && new Date(user.resetExpires).getTime() < Date.now()

    if (!user || expired) {
      return res.status(400).json({ message: 'Token invalide ou expiré' })
    }

    await users.updatePassword(user.id, passwords.hash(password))
    res.json({ message: 'Mot de passe mis à jour. Vous pouvez vous connecter.' })
  } catch (err) {
    console.error('reset-password error:', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
