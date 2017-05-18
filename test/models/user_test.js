require('chai').should()
const expect = require('chai').expect
const User = require('../../src/models/user')
const Gallery = require('../../src/models/gallery')
const Image = require('../../src/models/image')

describe('User model', () => {
  let userOne
  let userTwo
  let galleryOne
  let galleryTwo
  let imageOne
  let imageTwo

  beforeEach(done => {
    userOne = new User({ username: 'Ross' })
    galleryOne = new Gallery({ title: 'Dogs' })
    imageOne = new Image({ path: 'http://lorempixel.com/400/200/', source: 'Lorem Pixel' })

    userTwo = new User({ username: 'Art' })
    galleryTwo = new Gallery({ title: 'Cats' })
    imageTwo = new Image({ path: 'http://lorempixel.com/400/200/', source: 'Lorem Pixel' })

    userOne.galleries = [galleryOne._id]
    galleryOne.user = userOne._id
    galleryOne.images = [imageOne._id]
    galleryOne.favorited_by = [userTwo._id]
    imageOne.gallery = galleryOne._id

    userTwo.galleries = [galleryTwo._id]
    userTwo.favorites = [galleryOne._id]
    galleryTwo.user = userTwo._id
    galleryTwo.images = [imageTwo._id]
    imageTwo.gallery = galleryTwo._id

    Promise.all([userOne.save(), userTwo.save(), galleryOne.save(), galleryTwo.save(), imageOne.save(), imageTwo.save()])
      .then(() => done())
      .catch(error => done(error))
  })

  it('should save a user', (done) => {
    User.findById(userOne._id)
      .then((user) => {
        user.should.be.an('object')
        done()
      })
      .catch(error => done(error))
  })
  it('should update a user', (done) => {
    User.findByIdAndUpdate(userOne._id, { username: 'RossBaquir' }, { new: true })
      .then((user) => {
        userOne.username.should.not.equal('RossBaquir')
        user.username.should.equal('RossBaquir')
        done()
      })
      .catch(error => done(error))
  })
  it('should delete a user and all its relationships', (done) => {
    let userGalleries

    Gallery.find({ user: { $in: userTwo._id } })
      .then(res => { userGalleries = res })
      .catch(error => done(error))

    userTwo.remove()
      .then(() => {
        User
          .findById(userTwo._id)
          .then(res => {
            expect(res).to.be.null
          })
        return Promise.resolve()
      })
      .then(() => Gallery.find({ user: { $in: userTwo._id } }).count())
      .then(count => {
        count.should.equal(0)
        return Promise.resolve()
      })
      .then(() => Image.find({ gallery: { $in: userGalleries } }).count())
      .then(count => {
        count.should.equal(0)
        return Promise.resolve()
      })
      .then(() => Gallery.find({ favorited_by: { $in: [userTwo._id] } }).count())
      .then(count => {
        count.should.equal(0)
        done()
      })
      .catch(error => done(error))
  })
})
