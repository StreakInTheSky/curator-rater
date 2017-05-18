require('chai').should()
const expect = require('chai').expect
const Gallery = require('../../src/models/gallery')
const User = require('../../src/models/user')

describe('Gallery model', () => {
  let testUser
  let testGallery

  beforeEach(done => {
    testUser = new User({ username: 'Bill' })
    testGallery = new Gallery({ title: 'Birds' })

    testGallery.user = testUser._id
    Promise.all([testUser.save(), testGallery.save()])
      .then(() => done())
      .catch(error => done(error))
  })

  it('should save a gallery', (done) => {
    Gallery.findById(testGallery._id)
      .then((gallery) => {
        gallery.should.be.an('object')
        done()
      })
      .catch(error => done(error))
  })

  it('should update a gallery', (done) => {
    Gallery.findByIdAndUpdate(testGallery._id, { title: 'Babies' }, { new: true })
      .then((gallery) => {
        testGallery.title.should.not.equal('Babies')
        gallery.title.should.equal('Babies')
        done()
      })
      .catch(error => done(error))
  })

  it('should delete a gallery and all its images', (done) => {
    Gallery
      .findById(testGallery._id)
      .then(gallery => {
        gallery
          .remove()
          .then(() => {
            Gallery
              .findById(testGallery._id)
              .then(res => {
                expect(res).to.be.null
                done()
              })
          })
      })
      .catch(error => done(error))
  })
})
