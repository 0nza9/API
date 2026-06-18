const reviews = require('../repositories/reviews.repo')

// POST /avis — ajouter un avis
// identité de l'auteur / description / note de l'avis (la date est générée côté serveur)
module.exports = (req, res) => {
  const { author, description, rating } = req.body || {}

  if (!author || !description || rating === undefined) {
    return res
      .status(400)
      .json({ message: 'Champs requis : author, description, rating' })
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: 'rating doit être un nombre entre 1 et 5' })
  }

  const review = reviews.create({ author, description, rating })
  res.status(201).json(review)
}
