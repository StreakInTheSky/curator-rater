const validateGallery = (req, res) => {
  let toVerify = {}

  const verifiableFields = ['user', 'description', 'tags', 'images']

  verifiableFields.forEach(field => {
    if (field in req.body) {
      toVerify[field] = req.body[field]
    }
  })


  if (toVerify.user) {
    if (typeof toVerify.user !== 'string') {
      res.status(422).send('Incorrect field type: username')
      return false
    }

    toVerify.user = toVerify.user.trim()

    if (toVerify.user === '') {
      res.status(422).send('Incorrect field length: username')
      return false
    }
  }

  if (toVerify.description) {
    if (typeof toVerify.description !== 'string') {
      res.status(422).send('Incorrect field type: description')
      return false
    }

    toVerify.description = toVerify.description.trim()

    if (toVerify.description === '') {
      res.status(422).send('Incorrect field length: description')
      return false
    }
  }

  if (toVerify.tags) {
    if (typeof toVerify.tags !== 'object') {
      res.status(422).send('Incorrect field type: tags')
      return false
    }
  }

  if (toVerify.images) {
    if (typeof toVerify.images !== 'object') {
      res.status(422).send('Incorrect field type: images')
      return false
    }

    if (toVerify.images.length < 1) {
      res.status(422).send('Incorrect field length: images')
      return false
    }
  }

  return true
}

module.exports = { validateGallery }
