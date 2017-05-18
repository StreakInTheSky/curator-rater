require('chai').should()
const expect = require('chai').expect
const Image = require('../../src/models/image')
const Gallery = require('../../src/models/gallery')
const User = require('../../src/models/user')

describe('Image model', () => {
  let testUser
  let testGallery
  let testImage

  beforeEach(done => {
    testUser = new User({ username: 'Bill' })
    testGallery = new Gallery({ title: 'Baseball' })
    testImage = new Image({
      path: 'http://lorempixel.com/400/200/',
      source: 'Lorem Pixel'
    })

    testGallery.user = testUser._id
    testImage.gallery = testGallery._id
    Promise.all([testUser.save(), testGallery.save(), testImage.save()])
      .then(() => done())
      .catch(error => done(error))
  })

  it('should save an image', (done) => {
    Image.findById(testImage._id)
      .then((image) => {
        image.should.be.an('object')
        done()
      })
      .catch(error => done(error))
  })

  it('should update an image', (done) => {
    Image.findByIdAndUpdate(testImage._id, { source: 'Google' }, { new: true })
      .then((image) => {
        testImage.should.not.equal('Google')
        image.source.should.equal('Google')
        done()
      })
      .catch(error => done(error))
  })

  it('should delete an image', (done) => {
    Image
      .findById(testImage._id)
      .then(image => {
        image
          .remove()
          .then(() => {
            Image
              .findById(testImage._id)
              .then(res => {
                expect(res).to.be.null
                done()
              })
          })
      })
      .catch(error => done(error))
  })
})
