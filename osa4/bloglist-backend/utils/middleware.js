const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  req.token = auth && auth.startsWith('Bearer ')
    ? auth.replace('Bearer ', '')
    : null
  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decoded = jwt.verify(req.token, process.env.SECRET)
  if (!decoded.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  req.user = await User.findById(decoded.id)
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }
  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
}
