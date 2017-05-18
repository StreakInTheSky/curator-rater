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

GallerySchema.methods.apiRepr = (() => {
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
})

GallerySchema.pre('remove', function pre(next) {
  const Image = mongoose.model('image')

  // When you delete a gallery, delete all associated images
  Image.remove({ _id: { $in: this.images } })
    .then(() => next())
    .catch(error => next(error))
})

const Gallery = mongoose.model('gallery', GallerySchema)

module.exports = Gallery
