const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Yetkisiz erişim: sadece adminler erişebilir.' });
    }
  };
  
  module.exports = adminOnly;