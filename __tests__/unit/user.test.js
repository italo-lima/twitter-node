const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const User = require('../../src/models/User')

const factory = require('../factories')

mongoose.connect('mongodb://localhost:27017/desafio-sinergia-test', {
  useNewUrlParser: true
})

afterEach(async () => {
  await User.deleteMany()
});

beforeEach(async () => {
  await User.deleteMany()
});

it('should encrypt user password', async () => {
  
  const user = await factory.create('User')

  const passwordHash = await bcrypt.compare("123456", user.password)

  expect(passwordHash).toBe(true);
})