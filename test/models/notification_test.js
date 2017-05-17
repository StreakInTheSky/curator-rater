require('chai').should()
const Notification = require('../../src/models/notification')
const User = require('../../src/models/user')

describe('Notification model', () => {
  let testUser
  let notificationOne

  beforeEach(done => {
    testUser = new User({ username: 'Bill' })
    notificationOne = new Notification({ content: 'This is a test', is_new: true })

    notificationOne.user = testUser._id

    Promise.all([testUser.save(), notificationOne.save()])
      .then(() => done())
      .catch(error => done(error))
  })

  it('should create a notification', (done) => {
    Notification.findById(notificationOne._id)
      .then((notice) => {
        notice.should.be.an('object')
        notice.content.length.should.be.above(0)
        notice.is_new.should.equal(true)
        done()
      })
      .catch(error => done(error))
  })

  it('should mark notification as read', (done) => {
    Notification.findByIdAndUpdate(notificationOne._id, { is_new: false }, { new: true })
      .then((notice) => {
        notice.is_new.should.equal(false)
        done()
      })
      .catch(error => done(error))
  })
})
