const mongoose = require('mongoose');

// Quiz şeması
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Quiz başlığı
  joinCode: { type: String, required: true, unique: true }, // Katılım kodu
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
      mediaType: String,
      mediaUrl: String
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Oluşturan kullanıcı
}, {
  timestamps: true // Oluşturulma ve güncellenme zamanı otomatik eklenir
});

module.exports = mongoose.model('Quiz', quizSchema); // Model dışa aktarılır
