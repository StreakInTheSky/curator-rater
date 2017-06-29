const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const GallerySchema = new Schema({
  title: String,
  description: String,
  tags: [String],
  images: [{ type: ObjectId, ref: 'image' }],
  user: { type: ObjectId, ref: 'user' },
  created_at: Date,
  updated_at: Date,
  favorited_by: [{ type: ObjectId, ref: 'user' }]
})

GallerySchema.methods.apiRepr = function () {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    tags: this.tags,
    images: this.images,
    user: this.user,
    created_at: this.created_at,
    favorited_by: this.favorited_by
  }
}

GallerySchema.pre('remove', function deleteImages(next) {
  const Image = mongoose.model('image')

  Image.remove({ _id: { $in: this.images } })
    .then(() => next())
    .catch(error => next(error))
})

GallerySchema.pre('remove', function deleteFromFavorites(next) {
  const User = mongoose.model('user')

  User.update(
      { _id: this.favorited_by },
      { $pull: { favorites: { $in: [this._id] } } },
      { multi: true }
    )
    .then(() => next())
    .catch(error => next(error))
})

GallerySchema.pre('remove', function deleteFromUserGalleries(next) {
  const User = mongoose.model('user')

  User.update(
      { galleries: { _id: this._id } },
      { $pull: { galleries: { $in: [this._id] } } }
    )
    .then(() => next())
    .catch(error => next(error))
})

GallerySchema.post('save', function saveGalleryToUser(next) {
  const User = mongoose.model('user')

  User.update(
      { _id: this.user },
      { $push: { galleries: this._id } }
    )
    .then(() => next())
    .catch(error => next(error))
})

const Gallery = mongoose.model('gallery', GallerySchema)

module.exports = Gallery
