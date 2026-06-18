const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

module.exports = (req, res, next) => {
  const { email } = req.body || {}

  if (!email) {
    return res.status(400).json({ message: 'Champ requis : email' })
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Email invalide' })
  }

  next()
}
