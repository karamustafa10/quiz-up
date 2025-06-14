const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  joinCode: {
    type: String,
    required: true,
    unique: true
  },
  started: {
    type: Boolean,
    default: false
  },
  students: [
    {
      type: String // veya istersen ObjectId ile öğrenci modeline bağlayabilirsin
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);
