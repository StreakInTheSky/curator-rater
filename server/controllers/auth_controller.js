const jwt = require('jsonwebtoken')

const config = require('../config')

const createAuthToken = user => {
  return jwt.sign(
    { user },
    config.JWT_SECRET,
    {
      subject: user.username,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256'
    }
  )
}

module.exports = {
  login(req, res) {
    const authToken = createAuthToken(req.user.apiRepr())
    res.json({ authToken })
  },
  refresh(req, res) {
    const authToken = createAuthToken(req.user)
    res.json({ authToken })
  }
}
