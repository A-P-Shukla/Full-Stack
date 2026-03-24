require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())

morgan.token('body', (request) => {
  if (request.method !== 'POST') {
    return ''
  }
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then((count) => {
    const info = `Phonebook has info for ${count} people`
    const time = new Date().toString()
    response.send(`<p>${info}</p><p>${time}</p>`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }
      return response.json(person)
    })
    .catch(() => response.status(400).end())
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(() => response.status(400).end())
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  return person.save().then((savedPerson) => response.json(savedPerson))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
