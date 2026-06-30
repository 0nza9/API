const crypto = require('crypto')
const users = require('../repositories/users.repo')
const passwords = require('../lib/password')

// POST /login — vérifier les identifiants et renvoyer un token.
// email + password sont déjà validés par post.middleware.login.js
module.exports = (req, res) => {
  const { email, password } = req.body || {}

  const user = users.findByEmail(email)
  if (!user || !passwords.verify(password, user.passwordHash)) {
    // Même message dans les deux cas pour ne pas révéler si l'email existe.
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
  }

  const token = crypto.randomBytes(24).toString('hex')
  users.addToken(user.id, token) // remember it so the auth middleware can verify it
  res.json({ token, user: { id: user.id, email: user.email } })
}
