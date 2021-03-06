const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const ImageSchema = new Schema({
  path: String,
  source: String,
  posted_by: [{ type: ObjectId, ref: 'user' }],
  upvoted_by: [{ type: ObjectId, ref: 'image' }],
  gallery: { type: ObjectId, ref: 'gallery' },
  points: Number,
  created_at: Date,
  updated_at: Date
})

ImageSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    path: this.path,
    source: this.source,
    posted_by: this.posted_by,
    upvoted_by: this.upvoted_by,
    gallery: this.gallery,
    points: this.points,
    created_at: this.created_at,
  }
}

ImageSchema.post('save', function saveImagestoGallery(doc, next) {
  const Gallery = mongoose.model('gallery')

  Gallery.update(
      { _id: doc.gallery },
      { $push: { images: doc._id } }
    )
    .then(() => next())
    .catch(error => next(error))
})

const Image = mongoose.model('image', ImageSchema)

module.exports = Image
