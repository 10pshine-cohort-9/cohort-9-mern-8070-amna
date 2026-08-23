const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const connectDB = require('../src/config/db')
const User = require('../src/models/User')
const Category = require('../src/models/Category')
const Note = require('../src/models/Notes')

chai.use(chaiHttp)
const { expect } = chai

const testEmail = `notetest_${Date.now()}@test.com`
const otherUserEmail = `other_notetest_${Date.now()}@test.com`

let token
let otherToken
let userId
let otherUserId
let categoryId
let targetCategoryId
let noteId

before(async () => {
  await connectDB()

  // Register main test user
  const res1 = await chai.request(app)
    .post('/api/auth/signup')
    .send({
      name: 'Note Test User',
      email: testEmail,
      password: '12345678'
    })
  token = res1.body.token
  userId = res1.body.user.id

  // Register secondary test user for authorization tests
  const res2 = await chai.request(app)
    .post('/api/auth/signup')
    .send({
      name: 'Other Note User',
      email: otherUserEmail,
      password: '12345678'
    })
  otherToken = res2.body.token
  otherUserId = res2.body.user.id

  // Create a primary category for user 1
  const catRes = await chai.request(app)
    .post('/api/categories')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Work Notes', color: '#4A90E2' })
  categoryId = catRes.body._id

  // Create a target category for testing move notes
  const targetCatRes = await chai.request(app)
    .post('/api/categories')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Archived Notes', color: '#50E3C2' })
  targetCategoryId = targetCatRes.body._id
})

after(async () => {
  if (userId || otherUserId) {
    await Note.deleteMany({ userId: { $in: [userId, otherUserId] } })
    await Category.deleteMany({ userId: { $in: [userId, otherUserId] } })
  }
  await User.deleteMany({ email: { $in: [testEmail, otherUserEmail] } })
})

describe('Note API', () => {

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const res = await chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Meeting Notes',
          content: 'Discuss sprint goals and project timelines.',
          categoryId
        })
      expect(res).to.have.status(201)
      expect(res.body).to.have.property('_id')
      expect(res.body).to.have.property('title', 'Meeting Notes')
      expect(res.body).to.have.property('content', 'Discuss sprint goals and project timelines.')
      expect(res.body).to.have.property('categoryId', categoryId)
      noteId = res.body._id
    })

    it('should not create note with missing fields', async () => {
      const res = await chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Incomplete Note'
        })
      expect(res).to.have.status(400)
      expect(res.body).to.have.property('message', 'All fields are required')
    })

    it('should not create note with non-existent category', async () => {
      const fakeCategoryId = '609c25e836cf9829f06079c6'
      const res = await chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Invalid Category Note',
          content: 'Some content',
          categoryId: fakeCategoryId
        })
      expect(res).to.have.status(404)
      expect(res.body).to.have.property('message', 'Category not found')
    })

    it('should not create note without auth token', async () => {
      const res = await chai.request(app)
        .post('/api/notes')
        .send({
          title: 'Unauthorized Note',
          content: 'Content',
          categoryId
        })
      expect(res).to.have.status(401)
    })
  })

  describe('GET /api/notes', () => {
    it('should get all notes for authenticated user', async () => {
      const res = await chai.request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.at.least(1)
    })

    it('should not get notes without auth token', async () => {
      const res = await chai.request(app)
        .get('/api/notes')
      expect(res).to.have.status(401)
    })
  })

  describe('GET /api/notes/category/:categoryId', () => {
    it('should get notes by category ID', async () => {
      const res = await chai.request(app)
        .get(`/api/notes/category/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.at.least(1)
    })

    it('should return empty array for category with no notes', async () => {
      const res = await chai.request(app)
        .get(`/api/notes/category/${targetCategoryId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.have.lengthOf(0)
    })

    it('should not get notes by category without token', async () => {
      const res = await chai.request(app)
        .get(`/api/notes/category/${categoryId}`)
      expect(res).to.have.status(401)
    })
  })

  describe('GET /api/notes/search', () => {
    it('should search notes by title query', async () => {
      const res = await chai.request(app)
        .get('/api/notes/search?q=Meeting')
        .set('Authorization', `Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.at.least(1)
      expect(res.body[0].title).to.include('Meeting')
    })

    it('should return 400 if search query parameter is missing', async () => {
      const res = await chai.request(app)
        .get('/api/notes/search')
        .set('Authorization', `Bearer ${token}`)
      expect(res).to.have.status(400)
      expect(res.body).to.have.property('message', 'Search query required')
    })

    it('should not search notes without token', async () => {
      const res = await chai.request(app)
        .get('/api/notes/search?q=Meeting')
      expect(res).to.have.status(401)
    })
  })

  describe('PUT /api/notes/:id', () => {
    it('should update an existing note', async () => {
      const res = await chai.request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Meeting Notes',
          content: 'Updated content with action items.'
        })
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('title', 'Updated Meeting Notes')
      expect(res.body).to.have.property('content', 'Updated content with action items.')
    })

    it('should not update note belonging to another user', async () => {
      const res = await chai.request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          title: 'Hacked Title'
        })
      expect(res).to.have.status(403)
      expect(res.body).to.have.property('message', 'Unauthorized')
    })

    it('should return 404 for non-existent note ID', async () => {
      const fakeNoteId = '609c25e836cf9829f06079c6'
      const res = await chai.request(app)
        .put(`/api/notes/${fakeNoteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Non existent'
        })
      expect(res).to.have.status(404)
      expect(res.body).to.have.property('message', 'Note not found')
    })

    it('should not update note without auth token', async () => {
      const res = await chai.request(app)
        .put(`/api/notes/${noteId}`)
        .send({
          title: 'No token'
        })
      expect(res).to.have.status(401)
    })
  })

  describe('PUT /api/notes/move', () => {
    it('should move notes to target category', async () => {
      const res = await chai.request(app)
        .put('/api/notes/move')
        .set('Authorization', `Bearer ${token}`)
        .send({
          noteIds: [noteId],
          targetCategoryId
        })
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('message', 'Notes moved successfully')
    })

    it('should return 400 if noteIds or targetCategoryId missing', async () => {
      const res = await chai.request(app)
        .put('/api/notes/move')
        .set('Authorization', `Bearer ${token}`)
        .send({
          noteIds: [noteId]
        })
      expect(res).to.have.status(400)
      expect(res.body).to.have.property('message', 'noteIds and targetCategoryId required')
    })

    it('should return 404 if target category does not exist', async () => {
      const fakeCategoryId = '609c25e836cf9829f06079c6'
      const res = await chai.request(app)
        .put('/api/notes/move')
        .set('Authorization', `Bearer ${token}`)
        .send({
          noteIds: [noteId],
          targetCategoryId: fakeCategoryId
        })
      expect(res).to.have.status(404)
      expect(res.body).to.have.property('message', 'Target category not found')
    })

    it('should not move notes without auth token', async () => {
      const res = await chai.request(app)
        .put('/api/notes/move')
        .send({
          noteIds: [noteId],
          targetCategoryId
        })
      expect(res).to.have.status(401)
    })
  })

  describe('DELETE /api/notes/:id', () => {
    it('should not delete note belonging to another user', async () => {
      const res = await chai.request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${otherToken}`)
      expect(res).to.have.status(403)
      expect(res.body).to.have.property('message', 'Unauthorized')
    })

    it('should delete note successfully', async () => {
      const res = await chai.request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('message', 'Note deleted successfully')
    })

    it('should return 404 when deleting non-existent or already deleted note', async () => {
      const res = await chai.request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res).to.have.status(404)
      expect(res.body).to.have.property('message', 'Note not found')
    })

    it('should not delete note without auth token', async () => {
      const fakeNoteId = '609c25e836cf9829f06079c6'
      const res = await chai.request(app)
        .delete(`/api/notes/${fakeNoteId}`)
      expect(res).to.have.status(401)
    })
  })
})
