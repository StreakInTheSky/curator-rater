const Horseman = require('node-horseman')
const cheerio = require('cheerio')

const fetchImages = rawHtml => {
  const $ = cheerio.load(rawHtml)
  const images = $('main header')
    .siblings('div')
    .find('img')
    .map(function image() {
      let urlArray = $(this).attr('src').split('/')
      if (urlArray.indexOf('s640x640') > 0) {
        urlArray.splice(3, 2)
      }
      return urlArray.join('/')
    })
    .get()
  return images
}

const instagramFetch = (query, isTag, next) => {
  return new Horseman()
    .userAgent('Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36')
    .open(isTag ? `https://www.instagram.com/explore/tags/${query}` : `https://www.instagram.com/${query}`)
    .click('a:contains("Load")')
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .scrollTo(9999, 0)
    .wait(1000)
    .html()
    .then(fetchImages)
    .catch(error => next(error))
    .close()
}

module.exports = instagramFetch
