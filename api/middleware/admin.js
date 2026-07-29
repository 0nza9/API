// Exige que l'utilisateur soit un administrateur/modérateur.
// À chaîner APRÈS le middleware `auth` : il compte sur req.user déjà présent.
//   - 401 si non authentifié (géré par `auth`)
//   - 403 si authentifié mais sans les droits
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentification requise' })
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' })
  }
  next()
}
