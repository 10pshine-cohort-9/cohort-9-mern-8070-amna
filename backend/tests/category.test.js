const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const connectDB = require('../src/config/db')
const User = require('../src/models/User')
const Category = require('../src/models/Category')

chai.use(chaiHttp)
const { expect } = chai

const testEmail = `cattest_${Date.now()}@test.com`
let token
let categoryId

before(async () => {
  await connectDB()

  // Test user banao aur token lo
  const res = await chai.request(app)
    .post('/api/auth/signup')
    .send({
      name: 'Cat Test User',
      email: testEmail,
      password: '12345678'
    })
  token = res.body.token
})

after(async () => {
  await User.deleteMany({ email: testEmail })
  await Category.deleteMany({ userId: (await User.findOne({ email: testEmail }))?._id })
})

describe('Category API', () => {

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const res = await chai.request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Category', color: '#7B5EA7' })
      expect(res).to.have.status(201)
      expect(res.body).to.have.property('name', 'Test Category')
      categoryId = res.body._id
    })

    it('should not create duplicate category', async () => {
      const res = await chai.request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Category', color: '#7B5EA7' })
      expect(res).to.have.status(400)
      expect(res.body).to.have.property('message', 'Category already exists')
    })

    it('should not create category without token', async () => {
      const res = await chai.request(app)
        .post('/api/categories')
        .send({ name: 'No Auth Category' })
      expect(res).to.have.status(401)
    })
  })

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      const res = await chai.request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
    })

    it('should not get categories without token', async () => {
      const res = await chai.request(app)
        .get('/api/categories')
      expect(res).to.have.status(401)
    })
  })

  describe('DELETE /api/categories/:id', () => {
    it('should not delete General category', async () => {
      const categories = await chai.request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`)
      const general = categories.body.find(cat => cat.isDefault)

      const res = await chai.request(app)
        .delete(`/api/categories/${general._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ option: 'move' })
      expect(res).to.have.status(403)
    })

    it('should delete category and move notes to General', async () => {
      const res = await chai.request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ option: 'move' })
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('message', 'Category deleted successfully')
    })
  })
})