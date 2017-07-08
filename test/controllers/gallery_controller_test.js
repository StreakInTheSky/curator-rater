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
  it('handles a DELETE request to /api/gallery/:id', (done) => {
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
