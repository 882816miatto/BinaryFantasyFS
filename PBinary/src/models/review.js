const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({

  activity_id: {
    type: [String],
    required: true
  },

  user_id: {
    type: String,
    required: true
  },

  user_email: {
      type: String,
      required: true
  },

  evaluation: {
      type: Number,
      required: true
  },

  comment: { type: String }

})

mongoose.pluralize(null)
const model = mongoose.model('Review', reviewSchema)

module.exports = model