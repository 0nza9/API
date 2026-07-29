const reviews = require('../repositories/reviews.repo')

// PATCH /avis/:id — modifier un avis (contenu / note). Réservé aux admins.
// Mise à jour partielle : seuls les champs fournis sont modifiés.
module.exports = async (req, res, next) => {
  const { author, description, rating } = req.body || {}
  const data = {}

  if (author !== undefined) {
    if (typeof author !== 'string' || author.trim().length < 1 || author.length > 80) {
      return res.status(400).json({ message: 'author invalide (1 à 80 caractères)' })
    }
    data.author = author
  }
  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length < 1 || description.length > 1000) {
      return res.status(400).json({ message: 'description invalide (1 à 1000 caractères)' })
    }
    data.description = description
  }
  if (rating !== undefined) {
    if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating doit être un entier entre 1 et 5' })
    }
    data.rating = rating
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: 'Aucun champ à modifier' })
  }

  try {
    const review = await reviews.update(req.params.id, data)
    if (!review) {
      return res.status(404).json({ message: 'Avis introuvable' })
    }
    res.json(review)
  } catch (err) {
    next(err)
  }
}
