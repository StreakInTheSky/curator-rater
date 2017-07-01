const Gallery = require('../models/gallery')
const utils = require('../utilities/gallery_utilities')

module.exports = {
  create(req, res, next) {
    if (!req.body) {
      return res.status(400).send('No request body')
    }

    const requiredFields = ['user', 'title', 'description']

    requiredFields.forEach(field => {
      if (!(field in req.body.data)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message)
        return res.status(400).send(message)
      }
      return null
    })

    if (!utils.validateGallery(req, res)) {
      return next('Validation error')
    }

    const { user, title, description } = req.body.data

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
    return next(new Error('no gallery id supplied'))
  },
  update(req, res, next) {
    let toUpdate = {}

    if (!req.body) {
      return res.status(400).send('No request body')
    }

    const updatableFields = ['user', 'title', 'description', 'tags']

    updatableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field]
      }
    })

    if (!utils.validateGallery(req, res)) {
      return next('Validation error')
    }

    return Gallery
      .findByIdAndUpdate(req.params.galleryId, toUpdate)
      .then(gallery => res.status(201).json(gallery.apiRepr()))
      .catch(next)
  },
  delete(req, res, next) {
    Gallery
      .remove({ _id: req.params.galleryid })
      .then(() => res.status(204).end())
      .catch(next)
  }
}
