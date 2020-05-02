const {factory} = require('factory-girl')
const User = require('../src/models/User')

factory.define(
  'User',
  User,
  {
    name: 'Ítalo',
    email: 'italo@email.com',
    password: '123456'
  }
);

module.exports = factory