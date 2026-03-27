const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

if (!url) {
  console.error('MONGODB_URI is not defined')
} else {
  mongoose.connect(url).catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })
}

const phoneValidator = (value) => {
  if (!value || value.length < 8) {
    return false
  }
  return /^\d{2,3}-\d+$/.test(value)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: phoneValidator,
      message: (props) => `${props.value} is not a valid phone number`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
