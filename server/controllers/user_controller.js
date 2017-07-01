const User = require('../models/user')
const utils = require('../utilities/user_utilities')

module.exports = {
  create(req, res, next) {
    if (!req.body) {
      return res.status(400).send('No request body')
    }

    const requiredFields = ['username', 'email', 'password', 'passwordConfirm']

    requiredFields.forEach(field => {
      if (!(field in req.body.data)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message)
        return res.status(400).send(message)
      }
      return null
    })

    if (!utils.validateUser(req, res)) {
      return next('Validation error')
    }

    const { username, email, password } = req.body.data

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
          username,
          email,
          password: hash
        })
      })
      .then(user => {
        return res.status(201).json(user.apiRepr())
      })
      .catch(next)
  },
  getByQuery(req, res, next) {
    return User
      .find(req.params)
      .then(users => res.status(200).json(users.map(user => user.apiRepr())))
      .catch(next)
  },
  getOne(req, res, next) {
    if (req.params.username) {
      return User
        .findOne({ username: req.params.username })
        .populate('followers', ['username'])
        .populate('following', ['username'])
        .populate({
          path: 'galleries',
          populate: {
            path: 'images',
            model: 'image'
          }
        })
        .then(user => res.status(200).json(user.apiRepr()))
        .catch(next)
    }
    return next(new Error('please supply username'))
  },
  // getOne(req, res, next) {
  //   if (req.params.userId) {
  //     return User
  //       .findOne({ username: req.params.username })
  //       .populate('followers', ['username'])
  //       .populate('following', ['username'])
  //       .then(user => res.status(200).json(user.apiRepr()))
  //       .catch(next)
  //   }
  //   return next(new Error('please supply username'))
  // },
  follow(req, res, next) {
    const requiredFields = ['followerId', 'followingId']

    requiredFields.forEach(field => {
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message)
        return res.status(400).send(message)
      }
      return null
    })

    const { followerId, followingId } = req.body

    Promise.all([
      User.findByIdAndUpdate(followerId, { $addToSet: { following: followingId } }, { new: true }),
      User.findByIdAndUpdate(followingId, { $addToSet: { followers: followerId } }, { new: true })
    ])
      .then(users => res.json(users.map(user => user.apiRepr())))
      .catch(error => next(error))
  },
  unfollow(req, res, next) {
    const requiredFields = ['followerId', 'followingId']

    requiredFields.forEach(field => {
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message)
        return res.status(400).send(message)
      }
      return null
    })

    const { followerId, followingId } = req.body

    Promise.all([
      User.findByIdAndUpdate(followerId, { $pull: { following: followingId } }, { new: true }),
      User.findByIdAndUpdate(followingId, { $pull: { followers: followerId } }, { new: true })
    ])
      .then(users => res.json(users.map(user => user.apiRepr())))
      .catch(error => next(error))
  },
  update(req, res, next) {
    let toUpdate = {}

    if (!req.body) {
      return res.status(400).send('No request body')
    }

    const updatableFields = ['username', 'email', 'password', 'passwordConfirm']

    updatableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field]
      }
    })

    if (!utils.validateUser(req, res)) {
      return next('Validation error')
    }

    return User
      .findByIdAndUpdate(req.params.userid, toUpdate)
      .then(user => res.status(201).json(user.apiRepr()))
      .catch(next)
  },
  delete(req, res, next) {
    User
      .remove({ _id: req.params.userid})
      .then(() => res.status(204).end())
      .catch(next)
  }
}
