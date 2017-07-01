const chai = require('chai')
const chaiHttp = require('chai-http')
const { app } = require('../../server/server')
const User = require('../../server/models/user')

const should = chai.should()
chai.use(chaiHttp)

const newUser = {
  username: 'newguy',
  email: 'emailguy@email.com',
  password: 'abcdef12',
  passwordConfirm: 'abcdef12'
}

const otherUser = {
  username: 'otherguy',
  email: 'otheremail@email.com',
  password: 'password1',
  passwordConfirm: 'password1'
}

describe('User controller', () => {
  it('handles a GET request to /api/user', done => {
    User.create(newUser)
      .then(() => {
        chai.request(app)
          .get('/api/user/')
          .end((err, res) => {
            if (err) { return done(err) }

            res.body.should.have.length.of.at.least(1)

            return User.count()
              .then(count => {
                res.body.should.have.length.of(count)
                done()
              })
              .catch(error => done(error))
          })
      })
      .catch(error => done(error))
  })
  it('handles a GET request to /api/user/:username', done => {
    User.create(newUser)
      .then(user => {
        chai.request(app)
          .get(`/api/user/${user.username}`)
          .end((err, res) => {
            if (err) { return done(err) }

            res.body.username.should.equal(user.username)
            return done()
          })
      })
  })
  it('handles a POST request to /api/user', done => {
    User.count().then(count => {
      chai.request(app)
        .post('/api/user')
        .send({ data: newUser })
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
  it('handles a POST request to /api/user/follow', done => {
    Promise.all([User.create(newUser), User.create(otherUser)])
      .then((users) => {
        chai.request(app)
          .post('/api/user/follow')
          .send({
            followerId: users[0]._id,
            followingId: users[1]._id
          })
          .end((err, res) => {
            if (err) { return done(err) }

            res.body[0].following.should.include(users[1]._id.toString())
            res.body[1].followers.should.include(users[0]._id.toString())
            return done()
          })
      })
      .catch(error => done(error))
  })
  it('handles a POST request to /api/user/unfollow', done => {
    const user1 = new User({ username: 'One' })
    const user2 = new User({ username: 'Two' })

    user1.following = [user2._id]
    user2.followers = [user1._id]

    Promise.all([user1.save(), user2.save()])
      .then((users) => {
        users[0].following.should.include(user2._id.toString())
        users[1].followers.should.include(user1._id.toString())

        chai.request(app)
          .post('/api/user/unfollow')
          .send({
            followerId: users[0]._id,
            followingId: users[1]._id
          })
          .end((err, res) => {
            if (err) { return done(err) }

            res.body[0].following.should.not.include(users[1]._id.toString())
            res.body[1].followers.should.not.include(users[0]._id.toString())
            return done()
          })
      })
      .catch(error => done(error))
  })
  it('handles a PUT request to /api/user/:id', (done) => {
    User.create(newUser)
      .then(user => {
        chai.request(app)
          .put(`/api/user/${user._id}`)
          .send({ email: 'newemail@email.com' })
          .end((err) => {
            if (err) { return done(err) }

            return User.findById(user._id)
              .then(updatedUser => {
                updatedUser.email.should.equal('newemail@email.com')
                done()
              })
              .catch(error => done(error))
          })
      })
      .catch(error => done(error))
  })
  it('handles a DELETE request to /api/user/:id', (done) => {
    User.create(newUser)
      .then(user => {
        chai.request(app)
          .delete(`/api/user/${user._id}`)
          .end((err) => {
            if (err) { return done(err) }

            return User.findById(user._id)
              .then(deletedUser => {
                should.not.exist(deletedUser)
                done()
              })
              .catch(error => done(error))
          })
      })
      .catch(error => done(error))
  })
})
