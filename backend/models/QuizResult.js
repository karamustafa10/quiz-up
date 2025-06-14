const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  studentName: String,
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: Number,
  totalQuestions: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
