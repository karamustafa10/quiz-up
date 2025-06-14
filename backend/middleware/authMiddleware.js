const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // token'ı verify et
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // kullanıcıyı çek
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Yetkisiz erişim: Token geçersiz.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Yetkisiz erişim: Token yok.' });
  }
};
