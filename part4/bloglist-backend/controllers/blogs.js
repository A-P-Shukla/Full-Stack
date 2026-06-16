const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  try {
    const saved = await blog.save()
    user.blogs = user.blogs.concat(saved._id)
    await user.save()
    const populated = await saved.populate('user', { username: 1, name: 1, id: 1 })
    response.status(201).json(populated)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  // determine blog owner's id (handles populated user object or ObjectId)
  const blogUserId = blog.user && blog.user._id ? blog.user._id.toString() : (blog.user ? blog.user.toString() : null)

  if (blogUserId && blogUserId === user._id.toString()) {
    const delResult = await Blog.deleteOne({ _id: request.params.id, user: user._id })
    if (delResult.deletedCount === 1) {
      user.blogs = user.blogs.filter(b => b.toString() !== request.params.id.toString())
      await user.save()
      return response.status(204).end()
    }
    // if delete didn't happen, respond 500
    return response.status(500).json({ error: 'failed to delete blog' })
  }

  // if blog exists but creator does not match
  return response.status(401).json({ error: 'only the creator can delete the blog' })
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updated = await Blog.findByIdAndUpdate(request.params.id, { likes: body.likes }, { new: true, runValidators: true, context: 'query' })
  if (updated) {
    response.json(updated)
  } else {
    response.status(404).end()
  }
})

// comments: POST /:id/comments
blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body
  if (!comment) return response.status(400).json({ error: 'comment missing' })
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()
  blog.comments = blog.comments.concat(comment)
  const saved = await blog.save()
  response.status(201).json(saved)
})

module.exports = blogsRouter

