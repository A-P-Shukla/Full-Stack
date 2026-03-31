const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')

if (!config.MONGODB_URI) {
  console.error('MONGODB_URI is not defined')
} else {
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.error('error connecting to MongoDB:', error.message)
    })
}

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
