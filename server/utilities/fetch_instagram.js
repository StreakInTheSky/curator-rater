const Horseman = require('node-horseman')
const cheerio = require('cheerio')

const horseman = new Horseman()

const fetchImages = rawHtml => {
  const $ = cheerio.load(rawHtml)
  const images = $('main header').siblings('div').find('img').map(function image() {
    let urlArray = $(this).attr('src').split('/')
    if (urlArray.indexOf('s640x640') > 0) {
      urlArray.splice(3, 2)
    }
    return urlArray.join('/')
  }).get()
  return images
}

const searchByUser = (username) => {
  return horseman
    .open(`https://www.instagram.com/${username}`)
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
    .close()
}

const searchByTag = hashtag => {
  return horseman
    .open(`https://www.instagram.com/explore/tags/${hashtag}`)
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
    .close()
}

module.exports = { searchByUser, searchByTag }
