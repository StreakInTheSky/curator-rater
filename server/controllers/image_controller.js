const Image = require('../models/image')
const utils = require('../utilities/image_utilities')

module.exports = {
  create(req, res, next) {
    const requiredFields = ['path', 'user', 'gallery']

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
        points: 500
      })
      .then(() => {
        return res.status(201).send('Image upload successful')
      })
      .catch(next)
  }
}
