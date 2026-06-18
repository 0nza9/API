const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

module.exports = (req, res, next) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Champs requis : email, password' })
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'Email invalide' })
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res
      .status(400)
      .json({ message: 'Le mot de passe doit faire au moins 8 caractères' })
  }

  next()
}
