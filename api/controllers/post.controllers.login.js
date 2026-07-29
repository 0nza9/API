const crypto = require('crypto')
const users = require('../repositories/users.repo')
const passwords = require('../lib/password')

// Durée de vie d'une session (7 jours).
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

// POST /login — vérifier les identifiants et ouvrir une session.
// email + password sont déjà validés par post.middleware.login.js
module.exports = async (req, res, next) => {
  const { email, password } = req.body || {}

  try {
    const user = await users.findByEmail(email)
    if (!user || !passwords.verify(password, user.passwordHash)) {
      // Même message dans les deux cas pour ne pas révéler si l'email existe.
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    // Émission du jeton de session, avec expiration.
    const token = crypto.randomBytes(24).toString('hex')
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
    await users.addToken(user.id, token, expiresAt)

    // Stockage sécurisé : cookie httpOnly (inaccessible au JavaScript, anti-XSS),
    // SameSite=Lax (anti-CSRF de base), Secure en production (HTTPS uniquement).
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_TTL_MS,
    })

    res.json({ user: { id: user.id, email: user.email, isAdmin: user.isAdmin } })
  } catch (err) {
    next(err)
  }
}
