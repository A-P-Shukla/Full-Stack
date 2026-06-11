const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')

const start = async () => {
  let mongoUri = config.MONGODB_URI

  if (!mongoUri) {
    console.log('MONGODB_URI is not defined — starting in-memory MongoDB')
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server')
      const mongod = await MongoMemoryServer.create()
      mongoUri = mongod.getUri()
      console.log('In-memory MongoDB started')
    } catch (err) {
      console.error('Failed to start in-memory MongoDB:', err.message)
      process.exit(1)
    }
  }

  try {
    await mongoose.connect(mongoUri)
    console.log('connected to MongoDB')
  } catch (error) {
    console.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  }

  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
}

start()
