const Image = require('../models/image')
const utils = require('../utilities/image_utilities')

module.exports = {
  create(req, res, next) {
    if (!req.body.data) {
      return res.status(400).send('No request body')
    }

    const requiredFields = ['path', 'user', 'gallery']

    requiredFields.forEach(field => {
      if (!(field in req.body.data)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message)
        return res.status(400).send(message)
      }
      return null
    })

    if (!utils.validateImage(req, res)) {
      return next('Validation error')
    }

    const { path, source, user, gallery } = req.body.data

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
