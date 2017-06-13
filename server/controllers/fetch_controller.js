const request = require('request')
const fetchInstagram = require('../utilities/fetch_instagram')

module.exports = {
  fetchUrl(req, res, next) {
    if (req.query.imageUrl) {
      request(req.query.imageUrl).pipe(res)
    } else {
      next('invalid URL')
    }
  },
  fetchInstagram(req, res, next) {
    const fetch = new Promise((resolve, reject) => {
      if (req.query.username) {
        resolve(fetchInstagram(req.query.username, false, next))
      } else if (req.query.tag) {
        resolve(fetchInstagram(req.query.tag, true, next))
      } else {
        reject('invalid search')
      }
    })

    fetch.then(images => res.json(images)).catch(error => next(error))
  }
}
