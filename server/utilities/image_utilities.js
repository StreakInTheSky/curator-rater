const validateImage = (req, res) => {
  let toVerify = {}

  const verifiableFields = ['path', 'source', 'user', 'gallery']

  verifiableFields.forEach(field => {
    if (field in req.body) {
      toVerify[field] = req.body[field]
    }
  })

  if (toVerify.path) {
    if (typeof toVerify.path !== 'string') {
      res.status(422).send('Incorrect field type: path')
      return false
    }

    toVerify.source = toVerify.path.trim()

    if (toVerify.path === '') {
      res.status(422).send('Incorrect field length: path')
      return false
    }
  }

  if (toVerify.source) {
    if (typeof toVerify.source !== 'string') {
      res.status(422).send('Incorrect field type: source')
      return false
    }

    toVerify.source = toVerify.source.trim()

    if (toVerify.source === '') {
      res.status(422).send('Incorrect field length: source')
      return false
    }
  }

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

  if (toVerify.gallery) {
    if (typeof toVerify.tags !== 'string') {
      res.status(422).send('Incorrect field type: tags')
      return false
    }
  }

  return true
}

module.exports = { validateImage }
