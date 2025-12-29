const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs)
  })
})
blogsRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.title || !body.url) {
    return res.status(400).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0
  })

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})


module.exports = blogsRouter
