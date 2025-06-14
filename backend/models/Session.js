// Oturum (Session) modelini tanımlar
const mongoose = require('mongoose');

// Oturum şeması
const sessionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true // İlgili quiz
  },
  joinCode: {
    type: String,
    required: true,
    unique: true // Katılım kodu benzersiz olmalı
  },
  started: {
    type: Boolean,
    default: false // Oturum başlatıldı mı?
  },
  students: [
    {
      type: String // Katılan öğrenciler (isteğe bağlı ObjectId yapılabilir)
    }
  ]
}, {
  timestamps: true // Oluşturulma ve güncellenme zamanı otomatik eklenir
});

module.exports = mongoose.model('Session', sessionSchema); // Model dışa aktarılır
