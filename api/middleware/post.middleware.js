// Validation de la publication d'un avis (POST /avis) + anti-spam.
// Aucune confiance dans le client : tout est revérifié côté serveur.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

module.exports = (req, res, next) => {
  const { author, email, description, rating, website } = req.body || {}

  // --- Anti-spam : honeypot ---
  // "website" est un champ caché du formulaire, invisible pour un humain.
  // Seuls les bots le remplissent : s'il est rempli, on rejette la requête.
  if (website) {
    return res.status(400).json({ message: 'Requête invalide' })
  }

  // --- Champs requis ---
  if (!author || !description || rating === undefined) {
    return res
      .status(400)
      .json({ message: 'Champs requis : author, description, rating' })
  }

  // --- Bornes / types ---
  if (typeof author !== 'string' || author.trim().length < 1 || author.length > 80) {
    return res.status(400).json({ message: 'author invalide (1 à 80 caractères)' })
  }
  if (typeof description !== 'string' || description.trim().length < 1 || description.length > 1000) {
    return res.status(400).json({ message: 'description invalide (1 à 1000 caractères)' })
  }
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'rating doit être un entier entre 1 et 5' })
  }
  // email est optionnel, mais s'il est fourni il doit être valide.
  if (email !== undefined && email !== '' && !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Email invalide' })
  }

  next()
}
