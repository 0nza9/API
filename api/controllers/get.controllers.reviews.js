const reviews = require('../repositories/reviews.repo')

// GET /avis — voir tous les avis
module.exports = (req, res) => {
  res.json(reviews.getAll())
}
