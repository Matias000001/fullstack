const mongoose = require('mongoose')

const connectToMongo = (uri) => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch(error => {
      console.log('error connecting to MongoDB:', error.message)
    })
}

module.exports = connectToMongo
