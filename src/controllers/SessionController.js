const User = require('../models/User')
const ErrorApi = require('../errors')

class SessionController {
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      throw new ErrorApi('email/password incorrect')
    }

    if (!(await user.compareHash(password))) {
      throw new ErrorApi('email/password incorrect')
    }

    const { name, createdAt, updatedAt } = user

    const token = User.generateToken(user)

    return res.json({ name, email, createdAt, updatedAt, token})
  }
}

module.exports = new SessionController()
