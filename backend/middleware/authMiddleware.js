// Kimlik doğrulama işlemleri için middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kullanıcıyı doğrulayan middleware
const protect = async (req, res, next) => {
  let token;

  // Authorization header kontrolü
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token alınır
      token = req.headers.authorization.split(' ')[1];
      // Token doğrulanır ve kullanıcı bulunur
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next(); // Devam et
    } catch (error) {
      res.status(401).json({ message: 'Geçersiz token' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Token bulunamadı, yetkisiz erişim' });
  }
};

module.exports = { protect }; // Middleware dışa aktarılır
