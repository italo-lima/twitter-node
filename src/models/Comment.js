const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  comment_description: {
    type: String,
    required: true
  },
  user_comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Comment', CommentSchema);