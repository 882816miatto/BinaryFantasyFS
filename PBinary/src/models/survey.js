const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  typeOfQuestion: {
      type: String,
      required: true
  },

  questionOptions: {
    type: [String],
    required: true
  }

})

const surveySchema = new mongoose.Schema({

  status: {
    type: Boolean,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  user_id: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  group_id: {
    type: String,
    required: true
  },

  questions: {
    type: [questionSchema],
    required: true
  }
})

mongoose.pluralize(null)
const model = mongoose.model('Survey', surveySchema)

module.exports = model
