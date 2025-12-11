require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const path = require('path')
const app = express()

app.use(express.json())
const cors = require('cors')
app.use(cors({
  origin: ['http://localhost:3000', 'https://puhelinluettelo-backend-nnym.onrender.com'],
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.static('dist'))


var morgan = require('morgan')
morgan.token('body', (req) => {return req.method === 'POST' ? JSON.stringify(req.body) : ''})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))   


let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/info', (req, res) => {
  const count = persons.length
  const time = new Date()

  res.send(
    `<p>Phonebook has info for ${count} people</p>
     <p>${time}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  Person.findByIdAndRemove(id).then(() => {
    res.status(204).end()
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})



app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next()
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


