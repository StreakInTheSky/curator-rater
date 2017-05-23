require('chai').should()
const expect = require('chai').expect
const User = require('../../server/models/user')
const Gallery = require('../../server/models/gallery')
const Image = require('../../server/models/image')
const Notification = require('../../server/models/notification')

describe('User model', () => {
  let userOne
  let userTwo
  let galleryOne
  let galleryTwo
  let imageOne
  let imageTwo
  let notificationOne

  beforeEach(done => {
    userOne = new User({ username: 'Ross' })
    userTwo = new User({ username: 'Art' })
    galleryOne = new Gallery({ title: 'Dogs' })
    galleryTwo = new Gallery({ title: 'Cats' })
    imageOne = new Image({ path: 'http://lorempixel.com/400/200/', source: 'Lorem Pixel' })
    imageTwo = new Image({ path: 'http://lorempixel.com/400/200/', source: 'Lorem Pixel' })
    notificationOne = new Notification({ content: 'Your image is about to expire' })


    userOne.galleries = [galleryOne._id]
    userOne.following = [userTwo._id]
    userTwo.galleries = [galleryTwo._id]
    userTwo.followers = [userOne._id]
    userTwo.favorites = [galleryOne._id]
    userTwo.notifications = [notificationOne._id]
    galleryOne.user = userOne._id
    galleryOne.images = [imageOne._id]
    galleryOne.favorited_by = [userTwo._id]
    galleryTwo.user = userTwo._id
    galleryTwo.images = [imageTwo._id]
    imageOne.gallery = galleryOne._id

    notificationOne.user = userTwo.id
    imageTwo.gallery = galleryTwo._id

    Promise.all([userOne.save(), userTwo.save(), galleryOne.save(), galleryTwo.save(), imageOne.save(), imageTwo.save(), notificationOne.save()])
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

    userTwo.remove()
      .then(() => {
        User
          .findById(userTwo._id)
          .then(res => {
            expect(res).to.be.null
          })
        return Promise.resolve()
      })
      .then(() => Gallery.find({ user: { $in: userTwo._id } }))
      .then(res => {
        userGalleries = res
        return res.length
      })
      .then(count => {
        count.should.equal(0)
        return Promise.resolve()
      })
      .then(() => Image.find({ gallery: { $in: userGalleries } }).count())
      .then(count => {
        count.should.equal(0)
        return Promise.resolve()
      })
      .then(() => Notification.find({ user: { $in: userTwo.id } }).count())
      .then(count => {
        count.should.equal(0)
      })
      .then(() => Gallery.find({ favorited_by: { $in: [userTwo._id] } }).count())
      .then(count => {
        count.should.equal(0)
        return Promise.resolve()
      })
      .then(() => User.find({ following: { $in: [userTwo._id] } }).count())
      .then(count => {
        count.should.equal(0)
        done()
      })
      .catch(error => done(error))
  })
})
