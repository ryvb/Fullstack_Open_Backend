const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: checkNumber
    }
  },
})

function checkNumber(value) {
  if (/\d{3}-\d{5}/.test(value) || /\d{2}-\d{6}/.test(value)) {
    return true
  } else {
    return false
  }
}

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

