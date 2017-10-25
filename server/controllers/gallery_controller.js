const Gallery = require('../models/gallery')
const utils = require('../utilities/gallery_utilities')

module.exports = {
  create: async (req, res, next) => {
    const requiredFields = ['user', 'title', 'description']

    requiredFields.forEach(field => {
      if (!(field in req.body.data)) {
        return next({
          code: 422,
          reason: 'ValidationError',
          message: `Missing \`${field}\` in request body`,
          location: field
        })
      }
      return null
    })

    if (!utils.validateGallery(req, res)) {
      return next({
        code: 422,
        reason: 'ValidationError',
      })
    }

    const { user, title, description } = req.body.data
    const validatedUser = await utils.checkUser(user)
    if (!validatedUser) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'User not found',
        location: 'user'
      })
    }

    return Gallery
      .create({
        user,
        title,
        description
      })
      .then(gallery => {
        res.status(201).json(gallery.apiRepr())
      })
      .catch(next)
  },
  getByQuery(req, res, next) {
    return Gallery
      .find(req.params)
      .populate('user', ['username'])
      .populate('images')
      .then(galleries => res.status(200).json(galleries.map(gallery => gallery.apiRepr())))
      .catch(next)
  },
  getOne(req, res, next) {
    if (req.params.galleryId) {
      return Gallery
        .findOne({ id: req.params.galleryId })
        .then(gallery => res.status(200).json(gallery.apiRepr()))
        .catch(next)
    }
    return next({
      code: 422,
      reason: 'ValidationError',
      message: 'No gallery id supplied',
      location: 'params'
    })
  },
  update(req, res, next) {
    let toUpdate = {}

    const updatableFields = ['user', 'title', 'description', 'tags']

    updatableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field]
      }
    })

    if (!utils.validateGallery(req, res)) {
      return next({
        code: 422,
        reason: 'ValidationError',
      })
    }

    return Gallery
      .findByIdAndUpdate(req.params.galleryId, toUpdate)
      .then(gallery => res.status(201).json(gallery.apiRepr()))
      .catch(next)
  },
  delete(req, res, next) {
    Gallery
      .findById(req.params.galleryId)
      .then(gallery => {
        return gallery.remove()
      })
      .then(() => res.status(204).end())
      .catch(next)
  }
}
