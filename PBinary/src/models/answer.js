const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({

  optionsSelected: {
    type: [String],
    required: true
  },

  question_id: {
    type: String,
    required: true
  },

  survey_id: {
      type: String,
      required: true
  },

  user_id: {
      type: String,
      required: true
  }

})

mongoose.pluralize(null)
const model = mongoose.model('Answer', answerSchema)

module.exports = model