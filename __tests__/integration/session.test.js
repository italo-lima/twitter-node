const request = require('supertest')
const mongoose = require('mongoose');

const app = require('../../src/index')
const User = require('../../src/models/User')
const factory = require('../factories')

mongoose.connect('mongodb://localhost:27017/desafio-sinergia-test', {
  useNewUrlParser: true
})

afterEach(async () => {
  await User.deleteMany()
  await mongoose.connection.db.dropDatabase()
});

beforeEach(async () => {
  await User.deleteMany()
});

describe('Authetication', () => {

  it('should receive JWT token when autenticated with valid credentials', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .post('/session')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.status).toBe(200);
  })

  it('should not authenticated with invalid credentials', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .post('/session')
      .send({
        email: user.email,
        password: '1234567'
      })

    expect(response.status).toBe(401);
  })

  it('should return jwt token when authenticted', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .post('/session')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.body).toHaveProperty('token')
  })

  it('should be able to acess private routes when authenticated', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

    expect(response.status).toBe(200)
  })

  it('should not be able to acess private routes whihout jwt token', async () => {
    const response = await request(app)
      .get('/users')

    expect(response.status).toBe(401)
  })

  it('should not be able to acess private routes with invalid jwt token', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer 12343421`)

    expect(response.status).toBe(401)
  })

  it('should not be able to create jwt token if user not exists', async () => {
    
    const response = await request(app)
      .post('/session')
      .send({
        email: 'italo2@email.com',
        password: '123456'
      })

    expect(response.status).toBe(401)
  })
})