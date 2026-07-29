const users = require('../repositories/users.repo')

// Protège une route : exige une session valide.
// Le jeton est lu depuis le cookie httpOnly "token" (posé au /login) ou, à défaut,
// depuis l'en-tête "Authorization: Bearer <token>".
module.exports = async (req, res, next) => {
  const header = req.headers.authorization || ''
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null
  const token = (req.cookies && req.cookies.token) || bearer

  try {
    const user = token ? await users.findByToken(token) : null
    if (!user) {
      return res.status(401).json({ message: 'Authentification requise' })
    }

    req.user = { id: user.id, email: user.email, isAdmin: user.isAdmin }
    next()
  } catch (err) {
    next(err)
  }
}
