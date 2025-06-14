const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const { protect } = require('../middleware/authMiddleware');

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