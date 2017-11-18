const Image = require('../models/image')
const utils = require('../utilities/image_utilities')
const User = require('../models/user')
module.exports = {
  create(req, res, next) {
    const requiredFields = ['path', 'user', 'gallery']

    const missingField = requiredFields.find(field => !(field in req.body))

    if (missingField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      })
    }


    if (!utils.validateImage(req, res)) {
      return next({
        code: 422,
        reason: 'ValidationError',
      })
    }

    const { path, source, user, gallery } = req.body

    return Image
      .create({
        path,
        source,
        user: [user],
        gallery,
        created_at: Date.now()
      })
      .then(() => {
        return res.status(201).send('Image upload successful')
      })
      .catch(next)
  },
  vote(req, res, next) {
    const requiredFields = ['imageId', 'userId']
    const missingField = requiredFields.find(field => !(field in req.body))

    if (missingField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      })
    }
    const { imageId, userId } = req.body

    return Image
      .findByIdAndUpdate(
        imageId,
        { $push: { upvoted_by: userId } }
      )
      .then(() => {
        return User.findByIdAndUpdate(
          userId,
          { $push: { upvoted: imageId } },
          { new: true }
        )
        .then(user => Promise.resolve(user))
        .catch(err => Promise.reject(err))
      })
      .then(user => res.status(200).json(user.apiRepr()))
      .catch(err => next(err))
  }
}
