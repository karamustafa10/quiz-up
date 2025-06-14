const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const { protect } = require('../middleware/authMiddleware');

// Get user's quiz history
router.get('/my-history', protect, async (req, res) => {
  try {
    const results = await QuizResult.find({ studentName: req.user.username })
      .populate('quizId', 'title')
      .populate('sessionId', 'createdAt')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({ message: 'Quiz geçmişi alınamadı.' });
  }
});

// Belirli bir oturumun quiz sonuçlarını getirir
router.get('/:sessionId', protect, async (req, res) => {
  try {
    // Oturuma ait quiz sonuçları çekiliyor
    const results = await QuizResult.find({ sessionId: req.params.sessionId });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Quiz sonuçları alınamadı.' });
  }
});

module.exports = router;