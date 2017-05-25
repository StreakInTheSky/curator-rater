const User = require('../models/user')
// const utils = require('../utilities/user_utilities')

module.exports = {
  create(req, res, next) {
    if (!req.body) {
      return res.status(400).send('No request body')
    }

    const requiredFields = ['username', 'email', 'password', 'passwordConfirm']

    requiredFields.forEach(field => {
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message)
        return res.status(400).send(message)
      }
      return null
    })

    let { username, email, password, passwordConfirm } = req.body

    if (typeof username !== 'string') {
      return res.status(422).send('Incorrect field type: username')
    }

    username = username.trim()

    if (username === '') {
      return res.status(422).send('Incorrect field length: username')
    }

    if (typeof email !== 'string') {
      return res.status(422).send('Incorrect field type: email')
    }

    email = email.trim()

    if (email === '') {
      return res.status(422).send('Incorrect field length: email')
    }

    if (typeof password !== 'string') {
      return res.status(422).send('Incorrect field type: password')
    }

    password = password.trim()
    passwordConfirm = passwordConfirm.trim()

    if (password === '') {
      return res.status(422).send('Incorrect field length: password')
    }

    if (!(password === passwordConfirm)) {
      return res.status(422).send('passwords do not match')
    }

    // check for existing user
    return User
      .find({ username })
      .count()
      .exec()
      .then(count => {
        if (count > 0) {
          return res.status(422).send('username already taken')
        }
        // if no existing user, hash password
        return User.hashPassword(password)
      })
      .then(hash => {
        return User.create({
          username: username,
          email: email,
          password: hash
        })
      })
      .then(user => {
        return res.status(201).json(user.apiRepr())
      })
      .catch(next)
  },
  getAll(req, res, next) {
    return User
      .find({})
      .then(users => res.status(200).json(users.map(user => user.apiRepr())))
      .catch(next)
  }
}
