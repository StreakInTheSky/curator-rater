const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const { runServer, closeServer } = require('../server/server')
const { DATABASE_URL_TEST, PORT } = require('../server/config')

before(() => {
  return runServer(DATABASE_URL_TEST, PORT)
})

beforeEach((done) => {
  const { collections } = mongoose.connection
  const collectionKeys = Object.keys(collections)
  let counter = 0

  function check() {
    counter += 1
    if (counter === collectionKeys.length) {
      done()
    }
  }

  collectionKeys.forEach((collection) => {
    mongoose.connection.db.dropCollection(collection, (err, result) => { check() })
  })
})

after(() => {
  return closeServer()
})
