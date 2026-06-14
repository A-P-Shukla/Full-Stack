import jsonServer from 'json-server'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const server = jsonServer.create()
const router = jsonServer.router(__dirname + '/db.json')
const middlewares = jsonServer.defaults({ static: __dirname + '/public' })
const PORT = process.env.PORT || 3001

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Example modification: delay all responses slightly to simulate latency
server.use((req, res, next) => {
  setTimeout(next, 200)
})

// Validate POSTed anecdotes: content must be at least 5 characters
server.post('/anecdotes', (req, res, next) => {
  const content = req.body && req.body.content
  if (!content || content.toString().trim().length < 5) {
    return res.status(400).json({ error: 'content too short' })
  }
  next()
})

server.use(router)

server.listen(PORT, () => {
  console.log(`JSON Server running on port ${PORT}`)
})
