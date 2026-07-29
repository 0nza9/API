const reviews = require('../repositories/reviews.repo')

// GET /avis/:id — voir un avis.
module.exports = async (req, res, next) => {
  try {
    const review = await reviews.getById(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Avis introuvable' })
    }
    res.json(review)
  } catch (err) {
    next(err)
  }
}
