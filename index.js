const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.use(express.json())
app.use(cors())

morgan.token('person', (req, res) => {
  return JSON.stringify(req.body)
})
var morganLogger =  ':method :url :status :res[content-length] - :response-time ms :person'
app.use(morgan(morganLogger))

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.send(person)
  } else {
    res.status(404).end()
  }
})

const generateId = (max) => {
  return Math.floor(Math.random() * max)
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (body.number === undefined) {
    return res.status(400).json({
      error: 'number missing'
    })
  //If person exists
  } else if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name already exists'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(1000),
  }
  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.res.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  res.write(`<p>Phonebook has info for ${persons.length} people</p>`)
  res.write(Date())
  res.end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})