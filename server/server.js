const express = require('express')
const mongoose = require('mongoose')
const { PORT, DATABASE_URL } = require('./config')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')
mongoose.Promise = global.Promise

// Listen
let server

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Routes
routes(app)

// Middleware to handle error responses
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.code).json({ error: err.message })
  next()
})

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true })
      .then(() => {
        server = app.listen(port, () => {
          /* eslint-disable no-console*/
          console.log(`Your app is listening on port ${port}`)
          resolve()
        })
        .on('error', error => {
          mongoose.disconnect()
          reject(error)
        })
        return server
      })
      .catch(err => reject(err))
  })
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server')
      server.close(err => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
}

if (require.main === module) {
  runServer().catch(err => console.error(err))
}

module.exports = { app, runServer, closeServer }
