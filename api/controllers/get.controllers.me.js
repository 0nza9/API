// GET /me — renvoie l'utilisateur de la session courante.
// Chaîné après `auth` : si le cookie est absent/expiré, `auth` répond déjà 401.
// Sert au front-end à connaître l'état de connexion et le rôle (admin ou non).
module.exports = (req, res) => {
  res.json({ user: req.user })
}
