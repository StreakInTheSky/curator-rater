const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const { ObjectId } = Schema.Types

const SystemSchema = new Schema({
  name: String
})

SystemSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    name: this.name
  }
}

const System = mongoose.model('system', SystemSchema)

module.exports = System
