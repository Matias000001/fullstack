const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

let token

describe('blog api with token auth', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'testi', name: 'Testi', passwordHash })
    await user.save()

    const loginRes = await api
      .post('/api/login')
      .send({ username: 'testi', password: 'salasana' })

    token = loginRes.body.token
  })

  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
    assert(Array.isArray(response.body))
  })

  test('blog can be added with valid token', async () => {
    const newBlog = {
      title: 'Token blog',
      author: 'Tester',
      url: 'http://example.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogs = await Blog.find({})
    assert.strictEqual(blogs.length, 1)
  })

  test('blog cannot be added without token', async () => {
    const newBlog = {
      title: 'No token',
      author: 'Fail',
      url: 'http://example.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('blog deletion succeeds with correct user', async () => {
    const blogRes = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Delete me',
        author: 'Tester',
        url: 'http://example.com'
      })

    await api
      .delete(`/api/blogs/${blogRes.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })
})

after(async () => {
  await mongoose.connection.close()
})
