const reviews = require('../repositories/reviews.repo')

// DELETE /avis/:id — supprimer un avis. Réservé aux admins.
module.exports = async (req, res, next) => {
  try {
    const deleted = await reviews.remove(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Avis introuvable' })
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
