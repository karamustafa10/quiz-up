const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Session = require('../models/Session');
const generateJoinCode = require('../utils/generateJoinCode');

// Session başlat (POST)
router.post('/start', protect, async (req, res) => {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID eksik" });
    }

    const newSession = new Session({
      quizId,
      joinCode: generateJoinCode(),
      started: false,
      students: []
    });

    await newSession.save();
    res.json({ sessionId: newSession._id, joinCode: newSession.joinCode });
  } catch (err) {
    console.error('❌ Oturum başlatma hatası:', err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


// ✅ Session detaylarını getir (GET)
router.get('/:sessionId', async (req, res) => {
  try {
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
