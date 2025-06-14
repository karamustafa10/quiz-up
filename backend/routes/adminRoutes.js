const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Session = require('../models/Session');
const QuizResult = require('../models/QuizResult');

// Tüm kullanıcıları getir
router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Tüm quizleri getir
router.get('/quizzes', protect, adminOnly, async (req, res) => {
  const quizzes = await Quiz.find().populate('createdBy', 'username');
  res.json(quizzes);
});

// Genel analiz verisi
router.get('/analytics', protect, adminOnly, async (req, res) => {
  const [totalUsers, totalQuizzes, totalSessions, avgScoreData] = await Promise.all([
    User.countDocuments(),
    Quiz.countDocuments(),
    Session.countDocuments(),
    QuizResult.aggregate([{ $group: { _id: null, avgScore: { $avg: "$score" } } }])
  ]);

  res.json({
    totalUsers,
    totalQuizzes,
    totalSessions,
    averageScore: avgScoreData[0]?.avgScore?.toFixed(2) || 0
  });
});

// Kullanıcı silme
router.delete('/user/:id', protect, adminOnly, async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    res.json({ message: 'Kullanıcı silindi.' });
  });
  
  // Quiz silme
  router.delete('/quiz/:id', protect, adminOnly, async (req, res) => {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz bulunamadı.' });
    res.json({ message: 'Quiz silindi.' });
  });

module.exports = router;
