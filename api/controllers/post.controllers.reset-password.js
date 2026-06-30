const users = require('../repositories/users.repo')
const passwords = require('../lib/password')

// POST /reset-password — appliquer un nouveau mot de passe via un token.
// token + password sont déjà validés par post.middleware.reset-password.js
module.exports = (req, res) => {
  const { token, password } = req.body || {}
  const user = users.findByResetToken(token)

  const expired =
    user && user.reset && new Date(user.reset.expiresAt).getTime() < Date.now()

  if (!user || expired) {
    return res.status(400).json({ message: 'Token invalide ou expiré' })
  }

  users.updatePassword(user.id, passwords.hash(password))
  res.json({ message: 'Mot de passe mis à jour. Vous pouvez vous connecter.' })
}
