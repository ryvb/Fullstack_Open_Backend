const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/persons/', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

personsRouter.get('/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

personsRouter.delete('/persons/:id', (request, response, next) => {
  // eslint-disable-next-line no-unused-vars
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

personsRouter.post('/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

personsRouter.put('/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

personsRouter.use((request, response, next) => {
  request._startTime = new Date()
  next()
})

personsRouter.get('/info', (request, response, next) => {
  const time = request._startTime
  Person.countDocuments({})
    .then(count => {
      response.send(`<p> Phonebook has info for ${count} people </p>` + `${time}`)
    })
    .catch(error => next(error))
})

module.exports = personsRouter