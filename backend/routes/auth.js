const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register → Kullanıcı kayıt
router.post('/register', registerUser);

// POST /api/auth/login → Kullanıcı giriş
router.post('/login', loginUser);

module.exports = router;
