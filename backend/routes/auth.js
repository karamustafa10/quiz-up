const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Kullanıcı kayıt endpoint'i
router.post('/register', registerUser);

// Kullanıcı giriş endpoint'i
router.post('/login', loginUser);

// Profil güncelleme endpoint'i
router.put('/update-profile', protect, updateProfile);

module.exports = router;
