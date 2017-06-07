const request = require('request')

module.exports = {
  fetchUrl(req, res, next) {
    if (req.query.imageUrl) {
      request(req.query.imageUrl).pipe(res)
    }
  }
}
