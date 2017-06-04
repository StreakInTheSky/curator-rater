const passwordChecker = (password, passwordConfirm) => password === passwordConfirm

const validateUser = (req, res) => {

  let toVerify = {}

  const verifiableFields = ['username', 'email', 'password', 'passwordConfirm']

  verifiableFields.forEach(field => {
    if (field in req.body) {
      toVerify[field] = req.body[field]
    }
  })


  if (toVerify.username) {
    if (typeof toVerify.username !== 'string') {
      res.status(422).send('Incorrect field type: username')
      return false
    }

    toVerify.username = toVerify.username.trim()

    if (toVerify.username === '') {
      res.status(422).send('Incorrect field length: username')
      return false
    }
  }

  if (toVerify.email) {
    if (typeof toVerify.email !== 'string') {
      res.status(422).send('Incorrect field type: email')
      return false
    }

    toVerify.email = toVerify.email.trim()

    if (toVerify.email === '') {
      res.status(422).send('Incorrect field length: email')
      return false
    }
  }

  if (toVerify.password && toVerify.passwordConfirm) {
    if (typeof toVerify.password !== 'string') {
      res.status(422).send('Incorrect field type: password')
      return false
    }

    toVerify.password = toVerify.password.trim()
    toVerify.passwordConfirm = toVerify.passwordConfirm.trim()

    if (toVerify.password === '') {
      res.status(422).send('Incorrect field length: password')
      return false
    }

    if (!(passwordChecker(toVerify.password, toVerify.passwordConfirm))) {
      res.status(422).send('passwords do not match')
      return false
    }
  }

  return true
}

module.exports = { validateUser }
