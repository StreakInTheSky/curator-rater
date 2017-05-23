require('chai').should()
const expect = require('chai').expect
const Gallery = require('../../server/models/gallery')
const User = require('../../server/models/user')
const Image = require('../../server/models/image')

describe('Gallery model', () => {
  let userOne
  let userTwo
  let galleryOne
  let imageOne

  beforeEach(done => {
    userOne = new User({ username: 'Bill' })
    userTwo = new User({ username: 'Bob' })
    galleryOne = new Gallery({ title: 'Birds' })
    imageOne = new Image({
      path: 'http://lorempixel.com/400/200/',
      source: 'Lorem Pixel'
    })

    galleryOne.images = [imageOne._id]
    galleryOne.user = userOne._id
    galleryOne.favorited_by = [userTwo._id]
    userOne.galleries = [galleryOne._id]

    userTwo.favorites = [galleryOne._id]

    Promise.all([userOne.save(), userTwo.save(), galleryOne.save(), imageOne.save()])
      .then(() => done())
      .catch(error => done(error))
  })

  it('should save a gallery', (done) => {
    Gallery.findById(galleryOne._id)
      .then((gallery) => {
        gallery.should.be.an('object')
        done()
      })
      .catch(error => done(error))
  })

  it('should update a gallery', (done) => {
    Gallery.findByIdAndUpdate(galleryOne._id, { title: 'Babies' }, { new: true })
      .then((gallery) => {
        galleryOne.title.should.not.equal('Babies')
        gallery.title.should.equal('Babies')
        done()
      })
      .catch(error => done(error))
  })

  it('should delete a gallery and all its images', (done) => {
    galleryOne.remove()
      .then(() => {
        Gallery
          .findById(galleryOne._id)
          .then(res => {
            expect(res).to.be.null
          })
        return Promise.resolve()
      })
      .then(() => Image.count())
      .then(count => {
        count.should.equal(0)
        return Promise.resolve()
      })
      .then(() => User.find({ galleries: { $in: [galleryOne._id] } }))
      .then(res => {
        res.length.should.equal(0)
        return Promise.resolve()
      })
      .then(() => User.find({ favorites: { $in: [userTwo._id] } }).count())
      .then(count => {
        count.should.equal(0)
        done()
      })
      .catch(error => done(error))
  })
})
