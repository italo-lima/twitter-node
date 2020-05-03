const request = require('supertest')
const mongoose = require('mongoose');

const app = require('../../src/index')
const Publication = require('../../src/models/Publication')
const User = require('../../src/models/User')
const factory = require('../factories')

const tokenTestInvalid = 'eyJhbGciOiJIUzxxxxIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWVmYTM0NGVmOGM0NmRlZDFjY2MzYSIsImlhdCI6MTU4ODUyNTYyMSwiZXhwIjoxNTg4NjEyMDIxfQ.lXVGMRnK9d-OTaI0zNqtkZ7GUiVHPVenyQwXGYwua58'
const tokenTest = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWVmYTM0NGVmOGM0NmRlZDFjY2MzYSIsImlhdCI6MTU4ODUyNTYyMSwiZXhwIjoxNTg4NjEyMDIxfQ.lXVGMRnK9d-OTaI0zNqtkZ7GUiVHPVenyQwXGYwua58'

mongoose.connect('mongodb://localhost:27017/desafio-sinergia-test-publication', {
  useNewUrlParser: true
})

afterEach(async () => {
  await Publication.deleteMany()
  await mongoose.connection.db.dropDatabase()
});

beforeEach(async () => {
  await Publication.deleteMany()
});

describe('Publication', () => {
  it('must not access the route with invalid jwt token GET/publication', async () => {
     const response = await request(app)
      .get('/publication')
      .set('Authorization', `Bearer ${tokenTestInvalid}`)

    expect(response.status).toBe(401)
  })

  it('must not access the route with not exists jwt token GET/publication', async () => {
    const response = await request(app)
      .get('/publication')

    expect(response.status).toBe(401)
  })

  it('must not access the route with invalid jwt token POST/publication', async () => {
    const response = await request(app)
      .post('/publication')
      .set('Authorization', `Bearer ${tokenTestInvalid}`)

    expect(response.status).toBe(401)
  })

  it('must not access the route with not exists jwt token POST/publication', async () => {
    const response = await request(app)
      .post('/publication')

    expect(response.status).toBe(401)
  })

  it('must not access the route with invalid jwt token PUT/publication', async () => {
    const response = await request(app)
      .put('/publication')
      .set('Authorization', `Bearer ${tokenTestInvalid}`)

    expect(response.status).toBe(401)
  })

  it('must not access the route with not exists jwt token PUT/publication', async () => {
    const response = await request(app)
      .put('/publication')

    expect(response.status).toBe(401)
  })

  it('must not access the route with invalid jwt token DELETE/publication', async () => {
    const response = await request(app)
      .delete('/publication')
      .set('Authorization', `Bearer ${tokenTestInvalid}`)

    expect(response.status).toBe(401)
  })

  it('must not access the route with not exists jwt token DELETE/publication', async () => {
    const response = await request(app)
      .delete('/publication')

    expect(response.status).toBe(401)
  })

  it('should list all publications', async () => {
    const response = await request(app)
      .get('/publication/all')

      expect(response.status).toBe(200)
  })

  it('should list all publications of user authenticated', async ()=> {
    const user = await factory.create('User')

    const response = await request(app)
      .get('/publication')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

      expect(response.status).toBe(200)
  })

  it('should not create publication with description empty', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .post('/publication')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({})

      expect(response.status).toBe(400)
  })

  it('should create publication if description exists', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .post('/publication')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        'description': "Publication 1"
      })

      expect(response.status).toBe(200)
  })

  it('should not found publication', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .put('/publication/5eac583d2e77ea31f0cc655c')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        'description': "Publication 1"
      })

      expect(response.status).toBe(404)
  })

  it('should not update the publication of user._id is different of owner_user', async () => {
    const user = await factory.create('User')
    const publication = await factory.create('Publication')

    const response = await request(app)
      .put(`/publication/${publication._id}`)
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        'description': "Publication 1"
      })

      expect(response.status).toBe(401)
  })

  it('should update the publication of user authenticated', async () => {
    const publication = await factory.create('Publication', {owner_user: '5eaefa344ef8c46ded1ccc3a'})

    const response = await request(app)
      .put(`/publication/${publication._id}`)
      .set('Authorization', `Bearer ${tokenTest}`)
      .send({
        'description': "Publication Updated 1"
      })

      expect(response.status).toBe(200)
  })

  it('should not delete the publication that does not exist', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .delete(`/publication/5eac583d2e77ea31f0cc655c`)
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

      expect(response.status).toBe(404)
  })

  it('should not delete the publication of user._id is different of owner_user', async () => {
    const user = await factory.create('User')
    const publication = await factory.create('Publication')

    const response = await request(app)
      .delete(`/publication/${publication._id}`)
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

      expect(response.status).toBe(401)
  })

  it('should delete the publication of user authenticated', async () => {
    const publication = await factory.create('Publication', {owner_user: '5eaefa344ef8c46ded1ccc3a'})

    const response = await request(app)
      .delete(`/publication/${publication._id}`)
      .set('Authorization', `Bearer ${tokenTest}`)

      expect(response.status).toBe(204)
  })
})