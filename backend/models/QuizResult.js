// Quiz sonuçlarını tutan model
const mongoose = require('mongoose');

// Quiz sonucu şeması
const quizResultSchema = new mongoose.Schema({
  studentName: String, // Öğrenci adı
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true }, // Oturum
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true }, // Quiz
  score: Number, // Puan
  totalQuestions: Number, // Toplam soru sayısı
  createdAt: { type: Date, default: Date.now } // Sonuç oluşturulma zamanı
});

module.exports = mongoose.model('QuizResult', quizResultSchema); // Model dışa aktarılır
