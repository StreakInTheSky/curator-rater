const express = require('express')
const mongoose = require('mongoose')
const { PORT, DATABASE_URL } = require('./config')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const systemRouter = require('./routes/system')
mongoose.Promise = global.Promise

// Listen
let server

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Routes
systemRouter(app)

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err)
      }
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
