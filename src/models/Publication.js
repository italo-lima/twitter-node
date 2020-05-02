const mongoose = require('mongoose')
const Comment = require('../models/Comment')

const PublicationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
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
},
{
  timestamps: true
}
)

PublicationSchema.pre('remove', async function (next) {  

  await Comment.deleteMany({ _id : {
    "$in" : this.comments
    }
  })

  next()
})

module.exports = mongoose.model('Publication', PublicationSchema)