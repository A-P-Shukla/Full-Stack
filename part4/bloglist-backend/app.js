const express = require('express')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// Serve frontend build when available (single-repo setup)
const path = require('path')
const fs = require('fs')
const buildPath = path.join(__dirname, '..', 'part5', 'bloglist-frontend', 'dist')
if (fs.existsSync(buildPath)) {
	app.use(express.static(buildPath))
	app.get('*', (req, res) => {
		res.sendFile(path.join(buildPath, 'index.html'))
	})
}

module.exports = app
