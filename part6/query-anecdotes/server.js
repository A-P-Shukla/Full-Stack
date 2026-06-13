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

server.use(router)

server.listen(PORT, () => {
  console.log(`JSON Server running on port ${PORT}`)
})
