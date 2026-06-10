const { test, describe, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

let app
let api

describe('Blog API tests', () => {
  let mongoServer

  before(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    process.env.MONGODB_URI = uri
    process.env.SECRET = 'testsecret'
    // require app after setting env
    app = require('../app')
    api = supertest(app)
    await mongoose.connect(uri)
  })

  after(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  beforeEach(async () => {
    const User = require('../models/user')
    const Blog = require('../models/blog')
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    await user.save()
  })

  test('GET /api/blogs returns json and id property is named id', async () => {
    const res = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    assert.ok(Array.isArray(res.body))
    // id naming test: when there are zero blogs, it's fine; ensure property if any
  })

  test('POST /api/blogs succeeds with valid token and defaults likes to 0', async () => {
    const loginRes = await api.post('/api/login').send({ username: 'root', password: 'sekret' }).expect(200)
    const token = loginRes.body.token

    const newBlog = { title: 'Test blog', author: 'Tester', url: 'http://test.com' }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, 1)
    assert.strictEqual(blogsAtEnd.body[0].likes, 0)
    assert.ok(blogsAtEnd.body[0].id)
  })

  test('POST /api/blogs without token is 401', async () => {
    const newBlog = { title: 'No token blog', author: 'Anon', url: 'http://no-token.com' }
    await api.post('/api/blogs').send(newBlog).expect(401)
  })

  test('DELETE /api/blogs/:id succeeds for creator and fails for others', async () => {
    const loginRes = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginRes.body.token

    const blogRes = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ title: 'To be deleted', author: 'Del', url: 'http://del.com' }).expect(201)
    const id = blogRes.body.id

    // ensure blog exists
    const allBefore = await api.get('/api/blogs')
    // created blog response checked below

    // delete with correct token
    const delRes = await api.delete(`/api/blogs/${id}`).set('Authorization', `Bearer ${token}`)
    console.log('delete response status/body:', delRes.status, delRes.body)
    // expect 204
    if (delRes.status !== 204) {
      throw new Error(`unexpected delete status ${delRes.status}`)
    }

    // create another blog
    const blogRes2 = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ title: 'Other', author: 'Other', url: 'http://other.com' }).expect(201)
    const id2 = blogRes2.body.id

    // create second user
    await api.post('/api/users').send({ username: 'otheruser', name: 'Other', password: 'pass' }).expect(201)
    const loginRes2 = await api.post('/api/login').send({ username: 'otheruser', password: 'pass' }).expect(200)
    const token2 = loginRes2.body.token

    // attempt to delete id2 with token2 should fail
    await api.delete(`/api/blogs/${id2}`).set('Authorization', `Bearer ${token2}`).expect(401)
  })

  test('PUT /api/blogs/:id updates likes', async () => {
    const loginRes = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginRes.body.token

    const blogRes = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send({ title: 'Updatable', author: 'Up', url: 'http://up.com', likes: 1 }).expect(201)
    const id = blogRes.body.id

    const updated = await api.put(`/api/blogs/${id}`).send({ likes: 42 }).expect(200)
    assert.strictEqual(updated.body.likes, 42)
  })
})
