const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog(body)

  try {
    const saved = await blog.save()
    response.status(201).json(saved)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogsRouter
