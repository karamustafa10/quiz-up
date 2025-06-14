const express = require('express');
const Quiz = require('../models/Quiz');
const Session = require('../models/Session');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { createQuiz, joinQuiz } = require('../controllers/quizController');

// Quiz oluşturma endpoint'i
router.post('/create', protect, createQuiz);

// Quiz'e katılım endpoint'i
router.get('/join/:code', async (req, res) => {
  try {
    // Katılım koduna göre oturum ve quiz bilgisi çekiliyor
    const session = await Session.findOne({ joinCode: req.params.code }).populate('quizId');

    if (!session) {
      return res.status(404).json({ message: 'Oturum bulunamadı.' });
    }

    res.json({
      sessionId: session._id,
      quiz: session.quizId,
    });
  } catch (error) {
    console.error('Katılım hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

router.get('/my-quizzes', protect, async (req, res) => {
    try {
      const userId = req.user._id; // Çünkü protect içinde req.user = await User.findById(...)
      const quizzes = await Quiz.find({ createdBy: userId });
      res.json(quizzes);
    } catch (err) {
      console.error('Quiz listesi alınamadı:', err);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  });

  
router.post('/upload-media', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenemedi.' });
  }

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`; // URL olarak döner
  res.json({ url: fileUrl });
});

module.exports = router;
