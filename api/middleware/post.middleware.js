module.exports = (req, res, next) => {
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

  next()
}
