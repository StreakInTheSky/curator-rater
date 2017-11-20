const Gallery = require('../models/gallery')
const User = require('../models/user')
const utils = require('../utilities/gallery_utilities')

module.exports = {
  create: async (req, res, next) => {
    const requiredFields = ['user', 'title']

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
        description,
        created_at: Date.now()
      })
      .then(gallery => {
        res.status(201).json(gallery.apiRepr())
      })
      .catch(err => next(err))
  },
  getByQuery(req, res, next) {
    return Gallery
      .find(req.params)
      .populate('user', ['username'])
      .populate('images')
      .sort({ created_at: -1 })
      .then(galleries => res.status(200).json(galleries.map(gallery => gallery.apiRepr())))
      .catch(err => next(err))
  },
  getOne(req, res, next) {
    if (req.params.galleryId) {
      return Gallery
        .findOne({ _id: req.params.galleryId })
        .populate('user', 'username')
        .populate('images')
        .then(gallery => res.status(200).json(gallery.apiRepr()))
        .catch(err => next(err))
    }
    return next({
      code: 422,
      reason: 'ValidationError',
      message: 'No gallery id supplied',
      location: 'params'
    })
  },
  addFavorite(req, res, next) {
    const requiredFields = ['galleryId', 'userId']

    const missingField = requiredFields.find(field => !(field in req.body))

    if (missingField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      })
    }

    const { galleryId, userId } = req.body

    return Gallery.findByIdAndUpdate(
        galleryId,
        { $push: { favorited_by: userId } },
        { new: true }
      )
      .then((updatedGallery) => {
        return User.findByIdAndUpdate(
          userId,
          { $push: { favorites: galleryId } },
          { new: true }
        )
        .then(user => Promise.resolve({ updatedGallery, updatedUser: user }))
        .catch(err => Promise.reject(err))
      })
      .then(results => res.status(200).json({
        updatedGallery: results.updatedGallery.apiRepr(),
        updatedUser: results.updatedUser.apiRepr()
      }))
      .catch(error => next(error))
  },
  removeFavorite(req, res, next) {
    const requiredFields = ['galleryId', 'userId']

    const missingField = requiredFields.find(field => !(field in req.body))

    if (missingField) {
      return next({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      })
    }

    const { galleryId, userId } = req.body

    return Gallery.findByIdAndUpdate(
        galleryId,
        { $pull: { favorited_by: userId } },
        { new: true }
      )
      .then((updatedGallery) => {
        return User.findByIdAndUpdate(
          userId,
          { $pull: { favorites: galleryId } },
          { new: true }
        )
        .then(user => Promise.resolve({ updatedGallery, updatedUser: user }))
        .catch(err => Promise.reject(err))
      })
      .then(results => res.status(200).json({
        updatedGallery: results.updatedGallery.apiRepr(),
        updatedUser: results.updatedUser.apiRepr()
      }))
      .catch(error => next(error))
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
      .catch(err => next(err))
  },
  delete(req, res, next) {
    Gallery
      .findById(req.params.galleryId)
      .then(gallery => {
        return gallery.remove()
      })
      .then(() => res.status(204).end())
      .catch(err => next(err))
  }
}
