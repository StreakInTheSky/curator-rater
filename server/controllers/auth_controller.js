const User = require('../models/user')
const utils = require('../utilities/user_utilities')

module.exports = {
  getOrCreate(req, res, next) {
    if (!req.body) {
      return res.status(400).send('No request body')
    }

    const requiredFields = ['uid', 'username']

    requiredFields.forEach(field => {
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message)
        return res.status(400).send(message)
      }
      return null
    })

    User.findOne({ uid: req.body.uid })
      .then(user => {
        if (user) {
          return res.json(user)
        }
        return User.create({ uid: req.body.uid, username: req.body.username })
            .then(createdUser => res.status(204).json(createdUser))
            .catch(error => next(error))
      })
      .catch(error => next(error))
  }
}
