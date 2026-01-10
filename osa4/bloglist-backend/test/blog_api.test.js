const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Understanding React Patterns',
    author: 'Michael Chan',
    url: 'https://testtesttest.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.testtesttest.com/',
    likes: 5
  }
]

describe('when there are initially some blogs', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test.only('all blogs are returned as json and correct amount', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test.only('blog identifier is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('addition of a new blog', () => {

    test.only('a valid blog can be added and amount increases by one', async () => {
      const newBlog = {
        title: 'Async/Await in Node',
        author: 'Dan Abramov',
        url: 'https://example.com',
        likes: 3
      }

      const blogsAtStart = await Blog.find({})

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('Async/Await in Node'))
    })

    test.only('if likes is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'No likes given',
        author: 'Test Author',
        url: 'https://example.com'
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test.only('blog without title is not added', async () => {
      const newBlog = {
        author: 'Testi testaaja',
        url: 'https://testtesttest.com',
        likes: 1
      }

      await api.post('/api/blogs').send(newBlog).expect(400)
    })

    test.only('blog without url is not added', async () => {
      const newBlog = {
        title: 'Missing URL',
        author: 'Testi testaaja',
        likes: 1
      }

      await api.post('/api/blogs').send(newBlog).expect(400)
    })
  })
})

describe('deletion of a blog', () => {
  test.only('succeeds with status 204 if id is valid', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test.only('succeeds in updating likes', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedData = { likes: blogToUpdate.likes + 1 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salasana123', 10)
    const user = new User({ username: 'matias', name: 'Matias', passwordHash })
    await user.save()
  })

  test.only('cannot create user with short username', async () => {
    const newUser = { username: 'ab', name: 'Short', password: 'valid123' }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test.only('cannot create user with duplicate username', async () => {
    const duplicateUser = { username: 'matias', name: 'Duplicate', password: 'salasana123' }
    await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect(res => {
        assert(res.body.error.includes('unique'))
      })
  })
})


after(async () => {
  await mongoose.connection.close()
})
