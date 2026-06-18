const reviews = require('../repositories/reviews.repo')

// DELETE /avis/:id — supprimer un avis
module.exports = (req, res) => {
  const deleted = reviews.remove(req.params.id)
  if (!deleted) {
    return res.status(404).json({ message: 'Avis introuvable' })
  }
  res.status(204).end()
}
