const request = require('supertest')
const mongoose = require('mongoose');

const app = require('../../src/index')
const User = require('../../src/models/User')
const factory = require('../factories')
const tokenTest = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWVmYTM0NGVmOGM0NmRlZDFjY2MzYSIsImlhdCI6MTU4ODUyNTYyMSwiZXhwIjoxNTg4NjEyMDIxfQ.lXVGMRnK9d-OTaI0zNqtkZ7GUiVHPVenyQwXGYwua58'
const tokenTestInvalid = 'eyJhbGciOiJIUzxxxxIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWVmYTM0NGVmOGM0NmRlZDFjY2MzYSIsImlhdCI6MTU4ODUyNTYyMSwiZXhwIjoxNTg4NjEyMDIxfQ.lXVGMRnK9d-OTaI0zNqtkZ7GUiVHPVenyQwXGYwua58'

mongoose.connect('mongodb://localhost:27017/desafio-sinergia-test-user', {
  useNewUrlParser: true
})

afterEach(async () => {
  await User.deleteMany();
  await mongoose.connection.db.dropDatabase()
});

beforeEach(async () => {
  await User.deleteMany();
});

describe('User', () => {

  it('must not access the route with invalid jwt token GET/users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${tokenTestInvalid}`)

    expect(response.status).toBe(401)
  })

  it('must not access the route with not exists jwt token GET/users', async () => {
    const response = await request(app)
      .get('/users')

    expect(response.status).toBe(401)
  })

  it('must not access the route with invalid jwt token PUT/users', async () => {
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${tokenTestInvalid}`)

    expect(response.status).toBe(401)
  })

  it('must not access the route with not exists jwt token PUT/users', async () => {
    const response = await request(app)
      .put('/users')

    expect(response.status).toBe(401)
  })

  it('must not access the route with invalid jwt token DELETE/users', async () => {
    const response = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${tokenTestInvalid}`)

    expect(response.status).toBe(401)
  })

  it('must not access the route with not exists jwt token DELETE/users', async () => {
    const response = await request(app)
      .delete('/users')

    expect(response.status).toBe(401)
  })

  it('list info user authenticated', async () => {
    const user = await factory.create('User')
    
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

    expect(response.status).toBe(200)
  })

  it('error to list info user authenticated in route GET/users', async () => {
    const response = await request(app)
    .get('/users')
    .set('Authorization', `Bearer ${tokenTest}`)

    expect(response.status).toBe(404)
  })

  it('user creation in application', async () => {
    const response = await request(app)
    .post('/users')
    .send(
      {
        name: "Ítalo",
        email: 'italo@email.com',
        password: '123456'
      }
    )

    expect(response.status).toBe(200);
  })

  it('should not be created user with emails equals', async () => {
    const user = await factory.create('User')

    const response = await request(app)
    .post('/users')
    .send(
      {
        name: user.name,
        email: user.email,
        password: '123456'
      }
    )

    expect(response.status).toBe(401);
  })

  it('error to list info user authenticated in route PUT/users', async () => {
    const response = await request(app)
    .put('/users')
    .set('Authorization', `Bearer ${tokenTest}`)

    expect(response.status).toBe(404)
  })

  it('should update name and email password', async () => {
    const user = await factory.create('User')
    
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        name: 'Ítalo Lima',
        email: 'italo2@email.com.br',
      })

      expect(response.status).toBe(200)
  })

  it('should update password', async () => {
    const user = await factory.create('User')
    
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        oldPassword: "123456",
        password: "1234567"
      })

      expect(response.status).toBe(200)
  })

  it('should not update password with oldPassword incorrect', async () => {
    const user = await factory.create('User')
    
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        name: 'Ítalo Lima',
        email: 'italo2@email.com.br',
        oldPassword: "123456789",
        password: "1234567"
      })

      expect(response.status).toBe(401)
  })

  it('should not update email with email exists', async () => {
    const user = await factory.create('User')
    const user2 = await factory.create('User', {email: "italo2@email.com.br"})
    
    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        email: 'italo2@email.com.br',
      })

      expect(response.status).toBe(401)
  })

  it('should delete user with credentials valid', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

      expect(response.status).toBe(204)
  })

  it('should not be delete user with credentials invalid', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${tokenTest}`)

      expect(response.status).toBe(204)
  })
})