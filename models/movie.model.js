const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cast: [String]
})

module.exports = Movie = mongoose.model('movie', movieSchema)