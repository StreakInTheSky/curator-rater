const User = require('../models/user')

module.exports = {
  create(req, res, next) {

    // Validates req data
    const requiredFields = ['username', 'email', 'password']
    const missingField = requiredFields.find(field => !(field in req.body))

    if (missingField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      })
    }

    const nonStringField = requiredFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    )

    if (nonStringField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
      })
    }

    const explicityTrimmedFields = ['email', 'password']
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    )

    if (nonTrimmedField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Cannot start or end with whitespace',
        location: nonTrimmedField
      })
    }

    const sizedFields = {
      username: {
        min: 1
      },
      email: {
        min: 1
      },
      password: {
        min: 8,
        // bcrypt truncates after 72 characters, so let's not give the illusion
        // of security by storing extra (unused) info
        max: 72
      }
    }

    const tooSmallField = Object.keys(sizedFields).find(
       field =>
           'min' in sizedFields[field] &&
           req.body[field].trim().length < sizedFields[field].min
    )
    const tooLargeField = Object.keys(sizedFields).find(
       field =>
           'max' in sizedFields[field] &&
           req.body[field].trim().length > sizedFields[field].max
    )

    if (tooSmallField || tooLargeField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: tooSmallField
           ? `Must be at least ${sizedFields[tooSmallField]
                 .min} characters long`
           : `Must be at most ${sizedFields[tooLargeField]
                 .max} characters long`,
        location: tooSmallField || tooLargeField
      })
    }

    let { username = '', email, password } = req.body

    const emailRegX = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')

    if (!emailRegX.test(email)) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Not a valid email',
        location: 'email'
      })
    }

    username = username.trim()

    // check for existing user
    return User
      .find({ email })
      .count()
      .then(count => {
        if (count > 0) {
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'A user with that email already exists',
            location: 'email'
          })
        }
        // check if username in user
        return User.find({ username })
          .count()
          .then(newCount => {
            if (newCount > 0) {
              // There is an existing user with the same username
              return Promise.reject({
                code: 422,
                reason: 'ValidationError',
                message: 'Username already taken',
                location: 'username'
              })
            }
             // If there is no existing user, hash the password
            return User.hashPassword(password)
          })
      })
      .then(hash => {
        // Creates User
        return User.create({
          username,
          email,
          password: hash,
          created_at: Date.now()
        })
      })
      .then(user => {
        return res.status(201).json(user.apiRepr())
      })
      .catch(err => {
        // Forward validation errors on to the client, otherwise give a 500
        // error because something unexpected has happened
        if (err.reason === 'ValidationError') {
          return next(err)
        }
        return res.status(500).json({ code: 500, message: 'Internal server error' })
      })
  },
  getByQuery(req, res, next) {
    return User
      .find(req.params)
      .then(users => res.status(200).json(users.map(user => user.apiRepr())))
      .catch(error => next(error))
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
          },
          options: {
            sort: { created_at: -1 },
          }
        })
        .then(user => res.status(200).json(user.apiRepr()))
        .catch(error => next(error))
    }
    return next(new Error('please supply username'))
  },
  getOneById(req, res, next) {
    if (req.params.userId) {
      return User
        .findOne({ username: req.params.username })
        .populate('followers', ['username'])
        .populate('following', ['username'])
        .then(user => res.status(200).json(user.apiRepr()))
        .catch(error => next(error))
    }
    return next(new Error('please supply username'))
  },
  follow(req, res, next) {
    const requiredFields = ['followerId', 'followingId']

    requiredFields.forEach(field => {
      if (!(field in req.body)) {
        return next({
          code: 422,
          reason: 'ValidationError',
          message: `Missing \`${field}\` in request body`,
          location: field
        })
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
        return next({
          code: 422,
          reason: 'ValidationError',
          message: `Missing \`${field}\` in request body`,
          location: field
        })
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
    const updatableFields = ['username', 'email', 'password']

    const nonStringField = updatableFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    )

    if (nonStringField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
      })
    }

    const explicityTrimmedFields = ['email', 'password']
    const nonTrimmedField = explicityTrimmedFields.find(
      field => field in req.body && req.body[field].trim() !== req.body[field]
    )

    if (nonTrimmedField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Cannot start or end with whitespace',
        location: nonTrimmedField
      })
    }

    const sizedFields = {
      username: {
        min: 1
      },
      email: {
        min: 1
      },
      password: {
        min: 8,
        // bcrypt truncates after 72 characters, so let's not give the illusion
        // of security by storing extra (unused) info
        max: 72
      }
    }

    const tooSmallField = Object.keys(sizedFields).find(
       field =>
           field in req.body &&
           'min' in sizedFields[field] &&
           req.body[field].trim().length < sizedFields[field].min
    )
    const tooLargeField = Object.keys(sizedFields).find(
       field =>
           field in req.body &&
           'max' in sizedFields[field] &&
           req.body[field].trim().length > sizedFields[field].max
    )

    if (tooSmallField || tooLargeField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: tooSmallField
           ? `Must be at least ${sizedFields[tooSmallField]
                 .min} characters long`
           : `Must be at most ${sizedFields[tooLargeField]
                 .max} characters long`,
        location: tooSmallField || tooLargeField
      })
    }

    let toUpdate = {}

    updatableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field]
      }
    })

    return User
      .findByIdAndUpdate(req.params.userId, toUpdate)
      .then(user => res.status(201).json(user.apiRepr()))
      .catch(error => next(error))
  },
  delete(req, res, next) {
    User
      .findById(req.params.userId)
      .then(user => {
        return user.remove()
      })
      .then(() => res.status(204).end())
      .catch(error => next(error))
  }
}
