const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  req.token =
    authorization && authorization.startsWith('Bearer ')
      ? authorization.replace('Bearer ', '')
      : null
  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decoded = jwt.verify(req.token, process.env.SECRET)
  req.user = await User.findById(decoded.id)
  next()
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
}
