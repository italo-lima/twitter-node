const mongoose = require('mongoose')

const PublicationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  owner_user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

module.exports = mongoose.model('Publication', PublicationSchema)