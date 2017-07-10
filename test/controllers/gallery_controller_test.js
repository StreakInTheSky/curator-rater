const chai = require('chai')
const chaiHttp = require('chai-http')
const { app } = require('../../server/server')
const User = require('../../server/models/user')
const Gallery = require('../../server/models/gallery')

const should = chai.should()
chai.use(chaiHttp)

const userOne = {
  username: 'newguy',
  email: 'emailguy@email.com',
  password: 'abcdef12',
  passwordConfirm: 'abcdef12'
}

// const userTwo = {
//   username: 'otherguy',
//   email: 'otheremail@email.com',
//   password: 'password1',
//   passwordConfirm: 'password1'
// }

const galleryOne = {
  title: 'Pikachus',
  description: 'Bunch of Pikachus'
}



describe('Gallery Controller', () => {
  let gallery
  let user

  beforeEach(done => {
    User
      .create(userOne)
      .then(createdUser => {
        user = createdUser
        const newGallery = Object.assign({}, galleryOne, { user: createdUser._id })
        return Gallery.create(newGallery)
      })
      .then(createdGallery => {
        gallery = createdGallery
        done()
      })
  })
  it('should create a new gallery for a user', done => {
    const newGallery = {
      title: 'New Gallery',
      description: 'a new gallery',
      user: user._id
    }
    let galleryTwo

    chai.request(app)
      .post('/api/gallery/')
      .send({ data: newGallery })
      .then(res => {
        galleryTwo = res.body
        return User.findById(user._id)
          .catch(err => done(err))
      })
      .then(fetchedUser => {
        galleryTwo.user.should.equal(fetchedUser._id.toString())
        fetchedUser.galleries.should.include(galleryTwo.id)
        done()
      })
      .catch(err => done(err))
  })
  it('should delete a gallery and remove it from user', (done) => {
    chai.request(app)
      .delete(`/api/gallery/${gallery._id}`)
      .end((err) => {
        if (err) { return done(err) }

        return Gallery.findById(gallery._id)
          .then(deletedGallery => {
            should.not.exist(deletedGallery)
            return User.findById(user._id)
          })
          .then(fetchedUser => {
            fetchedUser.galleries.should.not.include(gallery._id)
            done()
          })
          .catch(error => done(error))
      })
  })
})
