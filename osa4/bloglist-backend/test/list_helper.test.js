const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

describe('total likes', () => {
const listWithOneBlog = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'First',
      author: 'A',
      url: 'http://a.com',
      likes: 5,
    },
    {
      _id: '2',
      title: 'Second',
      author: 'B',
      url: 'http://b.com',
      likes: 10,
    },
    {
      _id: '3',
      title: 'Third',
      author: 'C',
      url: 'http://c.com',
      likes: 7,
    }
  ]

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      _id: '2',
      title: 'Second',
      author: 'B',
      url: 'http://b.com',
      likes: 10,
    })
  })
})

describe('most blogs', () => {
  const blogs = [
    { author: 'A', likes: 1 },
    { author: 'B', likes: 2 },
    { author: 'A', likes: 3 },
    { author: 'C', likes: 4 },
    { author: 'A', likes: 5 },
  ]

  test('author with most blogs is returned', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'A',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  const blogs = [
    { author: 'A', likes: 1 },
    { author: 'B', likes: 10 },
    { author: 'A', likes: 5 },
    { author: 'B', likes: 7 },
    { author: 'C', likes: 3 },
  ]

  test('author with most total likes is returned', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'B',
      likes: 17
    })
  })
})


test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})
