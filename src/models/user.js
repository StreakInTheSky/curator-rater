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

UserSchema.pre('remove', next => {
  const Gallery = mongoose.model('gallery')

  // When you delete a user, delete all associated galleries
  Gallery.remove({ _id: { $in: this.galleries } })
    .then(() => next())
})

const User = mongoose.model('user', UserSchema)

module.exports = User
