const fieldChecker(arr) {
  const requiredFields = ['username', 'email', 'password', 'passwordConfirm']

  requiredFields.forEach(field => {
    if (!(field in arr)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
    return null
  })
}

const passwordChecker(password, passwordConfirm) {
  return password === passwordConfirm
}

const usernameChecker(username) {
  return User
  .find({username})
  .count()
  .exec()
  .then(count => {
    if (count > 0) {
      return true
      })
    }
}

module.exports = { fieldChecker, passwordChecker, usernameChecker }
