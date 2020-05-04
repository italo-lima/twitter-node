const request = require('supertest')
const mongoose = require('mongoose');

const app = require('../../src/index')
const Publication = require('../../src/models/Publication')
const User = require('../../src/models/User')
const Comment = require('../../src/models/Comment')
const factory = require('../factories')

const tokenTestInvalid = 'eyJhbGciOiJIUzxxxxIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWVmYTM0NGVmOGM0NmRlZDFjY2MzYSIsImlhdCI6MTU4ODUyNTYyMSwiZXhwIjoxNTg4NjEyMDIxfQ.lXVGMRnK9d-OTaI0zNqtkZ7GUiVHPVenyQwXGYwua58'
const tokenTest = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYWVmYTM0NGVmOGM0NmRlZDFjY2MzYSIsImlhdCI6MTU4ODUyNTYyMSwiZXhwIjoxNTg4NjEyMDIxfQ.lXVGMRnK9d-OTaI0zNqtkZ7GUiVHPVenyQwXGYwua58'

mongoose.connect('mongodb://localhost:27017/desafio-sinergia-test-comment', {
  useNewUrlParser: true
})

afterEach(async () => {
  await Comment.deleteMany()
  await mongoose.connection.db.dropDatabase()
});

beforeEach(async () => {
  await Comment.deleteMany()
});

describe('Comemnt', () => {
  it('must not access the route with invalid jwt token GET/comment', async () => {
    const response = await request(app)
     .get('/comment')
     .set('Authorization', `Bearer ${tokenTestInvalid}`)

   expect(response.status).toBe(401)
 })

 it('must not access the route with not exists jwt token GET/comment', async () => {
   const response = await request(app)
     .get('/comment')

   expect(response.status).toBe(401)
 })

  it('must not access the route with invalid jwt token GET/comment/my-comments', async () => {
    const response = await request(app)
     .get('/comment/my-comments')
     .set('Authorization', `Bearer ${tokenTestInvalid}`)

   expect(response.status).toBe(401)
 })

 it('must not access the route with not exists jwt token GET/comment/my-comments', async () => {
   const response = await request(app)
     .get('/comment/my-comments')

   expect(response.status).toBe(401)
 })

 it('must not access the route with invalid jwt token POST/comment', async () => {
   const response = await request(app)
     .post('/comment')
     .set('Authorization', `Bearer ${tokenTestInvalid}`)

   expect(response.status).toBe(401)
 })

 it('must not access the route with not exists jwt token POST/comment', async () => {
   const response = await request(app)
     .post('/comment')

   expect(response.status).toBe(401)
 })

 it('must not access the route with invalid jwt token PUT/comment', async () => {
   const response = await request(app)
     .put('/comment/5eac583d2e77ea31f0cc655b')
     .set('Authorization', `Bearer ${tokenTestInvalid}`)

   expect(response.status).toBe(401)
 })

 it('must not access the route with not exists jwt token PUT/comment', async () => {
   const response = await request(app)
     .put('/comment/5eac583d2e77ea31f0cc655b')

   expect(response.status).toBe(401)
 })

 it('must not access the route with invalid jwt token DELETE/comment', async () => {
   const response = await request(app)
     .delete('/comment/5eac583d2e77ea31f0cc655b')
     .set('Authorization', `Bearer ${tokenTestInvalid}`)

   expect(response.status).toBe(401)
 })

 it('must not access the route with not exists jwt token DELETE/comment', async () => {
   const response = await request(app)
     .delete('/comment/5eac583d2e77ea31f0cc655b')

   expect(response.status).toBe(401)
 })

 it('should list all comments for the authenticated user, but from other users posts', async () => {
    const comment = await factory.create('Comment', {user_comment: '5eaefa344ef8c46ded1ccc3a'})
    const publication = await factory.create('Publication', {
      owner_user: '5eaefa344ef8c46ded1ccc3b',
      comments: [comment._id]
    })

    const response = await request(app)
      .get('/comment/my-comments')
      .set('Authorization', `Bearer ${tokenTest}`)

    expect(response.status).toBe(200)
 })

 it('must list all comments for the authenticated user publication', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .get('/comment')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

      expect(response.status).toBe(200)
 })

 it('should not create comment with comment_description empty', async () => {
  const user = await factory.create('User')

  const response = await request(app)
    .post('/comment')
    .query({publicationID: '5ead69e77303cd40e478bd18'})
    .set('Authorization', `Bearer ${User.generateToken(user)}`)
    .send({})

    expect(response.status).toBe(400)
  })

 it('must not create comment because there is no publication in route POST/comment', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .post('/comment')
      .query({publicationID: '5ead69e77303cd40e478bd18'})
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        "comment_description": "Comment 1"
      })

    expect(response.status).toBe(404)
 })

 it('must create comment on the publication', async () => {
    const user = await factory.create('User')
    const publication = await factory.create('Publication')

    const response = await request(app)
      .post('/comment')
      .query({publicationID: `${publication._id}`})
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        "comment_description": "Comment 1"
      })

    expect(response.status).toBe(200)
 })

 it('must not update comment because there is no publication in route PUT/comment', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .put('/comment/5ead69e77303cd40e478bd18')
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({
        "comment_description": "Comment 1"
      })

    expect(response.status).toBe(404)
 })

 it('should not update the comment of user._id is different of user_comment', async () => {
  const user = await factory.create('User')
  const comment = await factory.create('Comment', {user_comment: '5eaf25c5dac2713632920b54'})

  const response = await request(app)
    .put(`/comment/${comment._id}`)
    .set('Authorization', `Bearer ${User.generateToken(user)}`)
    .send({
      'comment_description': "Comment Updated 1"
    })

    expect(response.status).toBe(401)
  })

  it('should not update comment with comment_description empty', async () => {
    const user = await factory.create('User')
    const comment = await factory.create('Comment', {user_comment: '5eaf25c5dac2713632920b54'})

    const response = await request(app)
      .put(`/comment/${comment._id}`)
      .set('Authorization', `Bearer ${User.generateToken(user)}`)
      .send({})

      expect(response.status).toBe(400)
  })

  it('should update comment belonging to the authenticated user', async () => {
    const comment = await factory.create('Comment', {user_comment: `5eaefa344ef8c46ded1ccc3a`})

    const response = await request(app)
      .put(`/comment/${comment._id}`)
      .set('Authorization', `Bearer ${tokenTest}`)
      .send({
        'comment_description': "Comment Updated 1"
      })

      expect(response.status).toBe(200)
  })

  it('should return error 500', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .delete(`/comment/5eac583d2e77ea31f0cc65`)
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

      expect(response.status).toBe(500)
  })

  it('should not delete the comment that does not exist', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .delete(`/comment/5eac583d2e77ea31f0cc655c`)
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

      expect(response.status).toBe(404)
  })

  it('should not delete the comment of user._id is different of user_comment', async () => {
    const user = await factory.create('User')
    const comment = await factory.create('Comment', {user_comment: '5eaf25c5dac2713632920b54'})

    const response = await request(app)
      .delete(`/comment/${comment._id}`)
      .set('Authorization', `Bearer ${User.generateToken(user)}`)

      expect(response.status).toBe(401)
  })

  it('should delete the comment of user authenticated', async () => {
    const comment = await factory.create('Comment', {user_comment: '5eaefa344ef8c46ded1ccc3a'})

    const response = await request(app)
      .delete(`/comment/${comment._id}`)
      .set('Authorization', `Bearer ${tokenTest}`)

      expect(response.status).toBe(204)
  })

})