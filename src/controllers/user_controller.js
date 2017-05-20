const User = require('../models/user')
const utils = require('../utilities/user-utilities')

module.exports = {
  create(req, res, next) {
    const requiredFields = ['username', 'email', 'password', 'passwordConfirm']

    requiredFields.forEach(field => {
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message)
        return res.status(400).send(message)
      }
      return null
    })

    if (!utils.passwordChecker(req.body.password, req.body.passwordConfirm)) {
      return res.status(400).send('passwords did not match')
    }

    const userProps = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }
    const user = new User(userProps)
    user.save()
      .then((savedUser) => {
        User.findById(savedUser._id)
          .then(() => {
            res.status(201).send(user.apiRepr())
          })
          .catch(next)
      })
      .catch(next)
  }
}
