const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Session = require('../models/Session');
const generateJoinCode = require('../utils/generateJoinCode');

// Yeni bir oturum başlatma endpoint'i
router.post('/start', protect, async (req, res) => {
  try {
    const { quizId } = req.body;

    // Quiz ID kontrolü
    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID eksik" });
    }

    // Yeni oturum nesnesi oluşturuluyor
    const newSession = new Session({
      quizId,
      joinCode: generateJoinCode(), // Katılım kodu üretiliyor
      started: false,
      students: []
    });

    await newSession.save(); // Oturum veritabanına kaydediliyor
    res.json({ sessionId: newSession._id, joinCode: newSession.joinCode });
  } catch (err) {
    console.error('❌ Oturum başlatma hatası:', err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Belirli bir oturumun detaylarını getiren endpoint
router.get('/:sessionId', async (req, res) => {
  try {
    // Oturum ve ilişkili quiz bilgisi çekiliyor
    const session = await Session.findById(req.params.sessionId)
      .populate({
        path: 'quizId',
        populate: { path: 'createdBy', select: 'username' }
      });
    if (!session) return res.status(404).json({ message: 'Session bulunamadı' });

    res.json({
      quiz: session.quizId,
      joinCode: session.joinCode
    });
  } catch (error) {
    console.error('Session getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
