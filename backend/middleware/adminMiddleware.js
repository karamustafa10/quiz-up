// Yalnızca admin kullanıcıların erişebileceği işlemler için middleware

// Admin kontrolü yapan middleware
function adminMiddleware(req, res, next) {
  // Kullanıcı admin mi kontrol edilir
  if (req.user && req.user.role === 'admin') {
    next(); // Devam et
  } else {
    res.status(403).json({ message: 'Yalnızca adminler erişebilir.' });
  }
}

module.exports = adminMiddleware; // Middleware dışa aktarılır