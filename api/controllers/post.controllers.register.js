const users = require('../repositories/users.repo')
const passwords = require('../lib/password')

// POST /register — créer un compte.
// email + password sont déjà validés par post.middleware.register.js
module.exports = async (req, res) => {
  const { email, password } = req.body || {}

  try {
    if (await users.findByEmail(email)) {
      return res
        .status(409)
        .json({ message: 'Un compte existe déjà avec cet email' })
    }

    const user = await users.create({
      email,
      passwordHash: passwords.hash(password),
    })
    res.status(201).json({ id: user.id, email: user.email })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
