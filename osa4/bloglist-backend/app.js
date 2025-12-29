require('dotenv').config()
const express = require('express')
const app = express()
const connectToMongo = require('./utils/mongo')

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

connectToMongo(MONGODB_URI)

app.use(express.json())
app.use('/api/blogs', require('./controllers/blogs'))

module.exports = app
