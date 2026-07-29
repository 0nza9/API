const reviews = require('../repositories/reviews.repo')

// POST /avis — publier un avis (ACCÈS PUBLIC, aucun compte requis).
// Les champs sont validés (et le honeypot anti-spam vérifié) par post.middleware.js.
// L'avis est créé non autorisé : il n'apparaît publiquement qu'après modération.
module.exports = async (req, res, next) => {
  const { author, email, description, rating } = req.body || {}

  try {
    const review = await reviews.create({ author, email, description, rating })
    res.status(201).json(review)
  } catch (err) {
    next(err)
  }
}
