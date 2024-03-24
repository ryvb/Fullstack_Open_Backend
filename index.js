require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

let persons = []

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  Person.findByIdAndDelete(request.params.id).then(result => {
    console.log(`Deleted`)
  })
  
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const double = persons.filter(person => person.name === body.name)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  } 

  if (double.length !== 0) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  persons = persons.concat(person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.use((request, response, next) => {
  request._startTime = new Date()
  next()
})

app.get('/info', (request, response) => {
  const n_persons = persons.length
  const time = request._startTime

  response.send(`<p> Phonebook has info for ${n_persons} people </p>` + `${time}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send( {error: 'unknown endpoint'} )
}

app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


/*

*/