require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

const app = express()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(savedBlog => {
    response.status(201).json(savedBlog)
  })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
