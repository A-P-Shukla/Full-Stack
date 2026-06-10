const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (!token) {
    request.user = null
    return next()
  }
  try {
    const decodedToken = jwt.verify(token, config.SECRET)
    if (!decodedToken.id) {
      request.user = null
      return next()
    }
    const user = await User.findById(decodedToken.id)
    request.user = user
    next()
  } catch (error) {
    request.user = null
    next()
  }
}

module.exports = { tokenExtractor, userExtractor }
