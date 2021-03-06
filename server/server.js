require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const morgan = require('morgan')
const bodyParser = require('body-parser')
// const cors = require('cors')
const { PORT, DATABASE_URL } = require('./config')

const { basicStrategy, jwtStrategy } = require('./utilities/auth_strategies')



const app = express()
const routes = require('./routes')
mongoose.Promise = global.Promise

// Listen
let server

// Cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

// Middleware
app.use(bodyParser.json())
// app.use(cors())
app.use(passport.initialize())
passport.use(basicStrategy)
passport.use(jwtStrategy)
app.use(morgan('common'))

// Routes
routes(app)

// Middleware to handle error responses
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.code).json(err)
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
