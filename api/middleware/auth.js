const users = require('../repositories/users.repo')

// Protège une route : exige un header "Authorization: Bearer <token>" valide.
// Le token est celui renvoyé par POST /login.
module.exports = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  const user = token ? users.findByToken(token) : null
  if (!user) {
    return res.status(401).json({ message: 'Authentification requise' })
  }

  req.user = { id: user.id, email: user.email }
  next()
}
