require('dotenv').config()
const express = require('express')
const app = express()
const connectToMongo = require('./utils/mongo')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

connectToMongo(MONGODB_URI)

app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', require('./controllers/blogs'))
app.use('/api/users', require('./controllers/users'))
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', require('./controllers/testing'))
}

app.use(middleware.errorHandler)

module.exports = app
