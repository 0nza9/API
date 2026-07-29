const users = require('../repositories/users.repo')
const { cookieOptions } = require('../lib/cookie')

// POST /logout — invalider la session courante.
// Chaîné après le middleware `auth` (req.user disponible).
module.exports = async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.token
    if (token) {
      await users.removeToken(req.user.id, token) // supprime le jeton en base
    }
    res.clearCookie('token', cookieOptions)
    res.json({ message: 'Déconnecté' })
  } catch (err) {
    next(err)
  }
}
