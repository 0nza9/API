const reviews = require('../repositories/reviews.repo')

// GET /avis/moderation — voir TOUS les avis, y compris ceux en attente.
// Réservé aux admins : c'est la file de modération.
module.exports = async (req, res, next) => {
  try {
    res.json(await reviews.getAll())
  } catch (err) {
    next(err)
  }
}
