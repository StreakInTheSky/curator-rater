const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const NotificationSchema = new Schema({
  user: { type: ObjectId, ref: 'user' },
  content: String,
  created_at: Date,
  is_new: Boolean
})

const Notification = mongoose.model('notification', NotificationSchema)

module.exports = Notification
