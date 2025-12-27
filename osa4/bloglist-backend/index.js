require('dotenv').config()
const express = require('express')
const app = express()
const connectToMongo = require('./utils/mongo')
connectToMongo(process.env.MONGODB_URI)
app.use(express.json())
const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
