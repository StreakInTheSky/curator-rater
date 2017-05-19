const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const UserSchema = new Schema({
  username: String,
  email: String,
  galleries: [{ type: ObjectId, ref: 'gallery' }],
  followers: [{ type: ObjectId, ref: 'user' }],
  following: [{ type: ObjectId, ref: 'user' }],
  favorites: [{ type: ObjectId, ref: 'gallery' }],
  notifications: [{ type: ObjectId, ref: 'notification' }],
  created_at: Date,
  updated_at: Date,
  upvoted: [{ type: ObjectId, ref: 'image' }]
})

UserSchema.methods.apiRepr = (() => {
  return {
    id: this._id,
    username: this.username,
    galleries: this.galleries,
    followers: this.followers,
    following: this.following,
    favorites: this.favorites
  }
})

UserSchema.pre('remove', function removeAssociations(next) {
  const Gallery = mongoose.model('gallery')

  // When a user is deleted, delete all associated galleries
  Gallery.find({ _id: { $in: this.galleries } })
    .then((galleries) => Promise.all(galleries.map(gallery => gallery.remove())))
    .then(() => {
      // deletes user from favorited galleries
      Gallery.update(
        { _id: this.favorites },
        { $pull: { favorited_by: { $in: [this._id] } } },
        { multi: true }
       )
       .catch(error => next(error))
    })
    .then(() => next())
    .catch(error => next(error))
})

const User = mongoose.model('user', UserSchema)

module.exports = User
