const {factory} = require('factory-girl')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')

const authConfig = require('../src/config/auth')
const User = require('../src/models/User')
const Publication = require('../src/models/Publication')
const Comment = require('../src/models/Comment')

factory.define(
  'User',
  User,
  {
    name: 'Ítalo',
    email: 'italo@email.com',
    password: '123456'
  }
);

factory.define(
  'Publication',
  Publication,
  {
    description: 'Publication 1',
    owner_user: null,
    comments: []
  }
);

factory.define(
  'Comment',
  Comment,
  {
    comment_description: 'Comment 1',
    user_comment: null
  }
);

module.exports = factory