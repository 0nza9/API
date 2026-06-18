const reviews = require('../repositories/reviews.repo')

// PUT /avis/:id/autoriser — autoriser un avis
module.exports = (req, res) => {
  const review = reviews.authorize(req.params.id)
  if (!review) {
    return res.status(404).json({ message: 'Avis introuvable' })
  }
  res.json(review)
}
