const User = require('../models/User')

class SessionController {
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ error: 'email/password incorrect' })
    }

    if (!(await user.compareHash(password))) {
      return res.status(401).json({ error: 'email/password incorrect' })
    }

    const { name, createdAt, updatedAt } = user

    const token = User.generateToken(user)

    return res.json({ name, email, createdAt, updatedAt, token})
  }
}

module.exports = new SessionController()
