const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')
const Publication = require('../models/Publication')
const Comment = require('../models/Comment')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
},
  {
    timestamps: true
  }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  
  this.password = await bcrypt.hash(this.password, 8)
})

UserSchema.pre('remove', async function (next) {
  const removeId = this._id
  const pub = await Publication.find({owner_user: removeId})
  const ids = []

  pub.forEach(({comments}) => comments instanceof Array ? ids.push(...comments) : ids.push(comments))
  await Publication.deleteMany({owner_user: removeId})
  await Comment.deleteMany({ 
    _id : { "$in" : ids}
  })

  next()
})

UserSchema.methods = {
  compareHash (password) {
    return bcrypt.compare(password, this.password)
  }
}

UserSchema.statics = {
  generateToken ({ id }) {
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.ttl
    })
  }
}

module.exports = mongoose.model('User', UserSchema)
