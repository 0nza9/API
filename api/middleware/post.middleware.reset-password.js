module.exports = (req, res, next) => {
  const { token, password } = req.body || {}

  if (!token || !password) {
    return res
      .status(400)
      .json({ message: 'Champs requis : token, password' })
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res
      .status(400)
      .json({ message: 'Le mot de passe doit faire au moins 8 caractères' })
  }

  next()
}
