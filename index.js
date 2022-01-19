const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('person', (req, res) => {
  return JSON.stringify(req.body)
})
var morganLogger =  ':method :url :status :res[content-length] - :response-time ms :person'
app.use(morgan(morganLogger))

//============== ROUTES ===============

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
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
  } else if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name already exists'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  console.log(person)
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  res.write(`<p>Phonebook has info for ${persons.length} people</p>`)
  res.write(Date())
  res.end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})