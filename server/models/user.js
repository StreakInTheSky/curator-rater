const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  galleries: [{ type: ObjectId, ref: 'gallery' }],
  followers: [{ type: ObjectId, ref: 'user' }],
  following: [{ type: ObjectId, ref: 'user' }],
  favorites: [{ type: ObjectId, ref: 'gallery' }],
  notifications: [{ type: ObjectId, ref: 'notification' }],
  created_at: Date,
  updated_at: Date,
  upvoted: [{ type: ObjectId, ref: 'image' }]
})

UserSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    username: this.username,
    galleries: this.galleries,
    followers: this.followers,
    following: this.following,
    favorites: this.favorites
  }
}

UserSchema.methods.validatePassword = function (password) {
  return bcrypt
    .compare(password, this.password)
    .then(isValid => isValid)
}

UserSchema.statics.hashPassword = function (password) {
  return bcrypt
    .hash(password, 10)
    .then(hash => hash)
}

UserSchema.pre('remove', function deleteGalleries(next) {
  const Gallery = mongoose.model('gallery')

  Gallery.find({ _id: { $in: this.galleries } })
    .then((galleries) => Promise.all(galleries.map(gallery => gallery.remove())))
    .then(() => next())
    .catch(error => next(error))
})

UserSchema.pre('remove', function deleteNotifications(next) {
  const Notification = mongoose.model('notification')

  Notification.find({ _id: { $in: this.notifications } })
  .then((notifications) => Promise.all(notifications.map(notification => notification.remove())))
  .then(() => next())
  .catch(error => next(error))
})

UserSchema.pre('remove', function removeFromFavorites(next) {
  const Gallery = mongoose.model('gallery')

  Gallery.update(
    { _id: this.favorites },
    { $pull: { favorited_by: { $in: [this._id] } } },
    { multi: true }
   )
   .then(() => next())
   .catch(error => next(error))
})

UserSchema.pre('remove', function removeFromFollowerLists(next) {
  User.update(
    { _id: this.followers },
    { $pull: { following: { $in: [this._id] } } },
    { multi: true }
  )
  .then(() => next())
  .catch(error => next(error))
})

const User = mongoose.model('user', UserSchema)

module.exports = User
