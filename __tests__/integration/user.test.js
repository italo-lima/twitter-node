const request = require('supertest')
const mongoose = require('mongoose');

const app = require('../../src/index')
const User = require('../../src/models/User')
const factory = require('../factories')

mongoose.connect('mongodb://localhost:27017/desafio-sinergia-test-user', {
  useNewUrlParser: true
})

afterEach(async () => {
  await User.deleteMany();
});

beforeEach(async () => {
  await User.deleteMany();
});

describe('User', () => {

  it('list info user', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

    expect(response.status).toBe(200)
  })

  it('error to list user info', async () => {
    const user = await factory.create('User')

    const response = await request(app)
    .get('/users')
    .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWQ2OWE3NzMwM2NkNDBlNDc4YmQxNiIsImlhdCI6MTU4ODQyMzEwMiwiZXhwIjoxNTg4NTA5NTAyfQ.15liPM6VYByOwzrqoGROh4ReCixxEkDPBk-KHvTu8o4`)

    expect(response.status).toBe(401)
  })

})