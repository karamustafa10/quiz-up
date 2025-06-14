const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-history', protect, async (req, res) => {
  const studentName = req.user.username;
  const results = await QuizResult.find({ studentName })
    .populate('quizId', 'title')
    .sort({ createdAt: -1 });
  res.json(results);
});

module.exports = router;