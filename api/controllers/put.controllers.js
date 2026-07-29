const reviews = require('../repositories/reviews.repo')

// PUT /avis/:id/autoriser — autoriser (modérer) un avis. Réservé aux admins.
module.exports = async (req, res, next) => {
  try {
    const review = await reviews.authorize(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Avis introuvable' })
    }
    res.json(review)
  } catch (err) {
    next(err)
  }
}
