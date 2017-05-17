require('chai').should()
const expect = require('chai').expect
const User = require('../../src/models/user')
const Gallery = require('../../src/models/gallery')
const Image = require('../../src/models/image')

describe('User model', () => {
  let userOne
  let userTwo
  let galleryOne
  let imageOne

  beforeEach(done => {
    userOne = new User({ username: 'Ross' })
    userTwo = new User({ username: 'Art' })
    galleryOne = new Gallery({ title: 'Cats' })
    imageOne = new Image({ path: 'http://lorempixel.com/400/200/', source: 'Lorem Pixel' })

    galleryOne.user = userOne._id
    userOne.galleries = [galleryOne._id]
    galleryOne.images = [imageOne._id]
    imageOne.gallery = galleryOne._id

    Promise.all([userOne.save(), userTwo.save(), galleryOne.save(), imageOne.save()])
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
    User
    .findById(userOne._id)
    .then(user => {
      user
      .remove()
      .then(() => {
        User
        .findById(userOne._id)
        .then(user => {
          expect(user).to.be.null
          done()
        })
      })
    })
    .catch(error => done(error))
  })
})
