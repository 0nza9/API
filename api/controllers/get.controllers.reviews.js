const reviews = require('../repositories/reviews.repo')

// GET /avis — voir les avis (ACCÈS PUBLIC).
// Seuls les avis autorisés (modérés) sont exposés publiquement.
module.exports = async (req, res, next) => {
  try {
    res.json(await reviews.getPublic())
  } catch (err) {
    next(err)
  }
}
