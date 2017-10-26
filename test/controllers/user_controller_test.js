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
  password: 'abcdef12'
}

const userTwo = {
  username: 'otherguy',
  email: 'otheremail@email.com',
  password: 'password1'
}

describe('User controller', () => {
  let user

  beforeEach(done => {
    User
      .create(userOne)
      .then(createdUser => {
        user = createdUser
        done()
      })
      .catch(err => done(err))
  })

  it('should get all users', done => {
    chai.request(app)
      .get('/api/user/')
      .end((err, res) => {
        if (err) { return done(err) }

        res.body.should.have.length.of.at.least(1)

        return User.count()
          .then(count => {
            res.body.should.have.lengthOf(count)
            done()
          })
          .catch(error => done(error))
      })
  })
  it('should get user by username', done => {
    chai.request(app)
      .get(`/api/user/${user.username}`)
      .end((err, res) => {
        if (err) { return done(err) }

        res.body.username.should.equal(user.username)
        return done()
      })
  })
  it('should create a new user', done => {
    User.count().then(count => {
      chai.request(app)
        .post('/api/user')
        .send(userTwo)
        .end((err) => {
          if (err) { return done(err) }
          return User.count()
            .then(newCount => {
              newCount.should.equal(count + 1)
              done()
            })
            .catch(error => done(error))
        })
    })
  })
  it('should check if users are being followed and unfollowed', done => {
    let otherUser

    User
      .create(userTwo)
      .then((createdUser) => {
        otherUser = createdUser

        return chai.request(app)
          .post('/api/user/follow')
          .send({
            followerId: user._id,
            followingId: otherUser._id
          })
          .then(() => {
            return User
              .findById(otherUser._id)
              .then(fetchedUser => { otherUser = fetchedUser })
              .then(() => User.findById(user._id))
          })
          .then(fetchedUser => {
            fetchedUser.following.should.include(otherUser._id.toString())
            otherUser.followers.should.include(user._id.toString())
            return Promise.resolve()
          })
          .catch(err => done(err))
      })
      .then(() => {
        chai.request(app)
          .post('/api/user/unfollow')
          .send({
            followerId: user._id,
            followingId: otherUser._id
          })
          .then(() => {
            return User
              .findById(otherUser._id)
              .then(fetchedUser => { otherUser = fetchedUser })
              .then(() => User.findById(user._id))
          })
          .then(fetchedUser => {
            fetchedUser.following.should.not.include(otherUser._id.toString())
            otherUser.followers.should.not.include(user._id.toString())
            done()
          })
          .catch(err => done(err))
      })
      .catch(error => done(error))
  })
  it('should update a user\'s details', (done) => {
    chai.request(app)
      .put(`/api/user/${user._id}`)
      .send({
        username: 'newName',
        email: 'newemail@email.com'
      })
      .end((err) => {
        if (err) { return done(err) }

        return User.findById(user._id)
          .then(updatedUser => {
            updatedUser.username.should.equal('newName')
            updatedUser.email.should.equal('newemail@email.com')
            done()
          })
          .catch(error => done(error))
      })
  })
  it('should delete a user and all its galleries', (done) => {
    const galleryOne = {
      user: user._id,
      title: 'Pikachus',
      description: 'Bunch of Pikachus'
    }

    let gallery

    Gallery.create(galleryOne)
      .then(createdGallery => {
        gallery = createdGallery
        return User.findByIdAndUpdate(user._id, { galleries: [createdGallery._id] }, { new: true })
      })
      .then(updatedUser => {
        updatedUser.galleries.should.include(gallery._id)

        return chai.request(app)
          .delete(`/api/user/${updatedUser._id}`)
          .then(() => {
            return User.findById(updatedUser._id)
              .then(deletedUser => {
                should.not.exist(deletedUser)
                return Promise.resolve()
              })
              .catch(error => done(error))
          })
      })
      .then(() => {
        Gallery.findById(gallery._id)
          .then(fetchedGallery => {
            should.not.exist(fetchedGallery)
            done()
          })
      })
      .catch(err => done(err))
  })
})
