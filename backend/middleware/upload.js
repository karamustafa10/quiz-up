// Multer ile dosya yükleme işlemleri için yapılandırma
const multer = require('multer');
const path = require('path');

// Dosyanın kaydedileceği klasör ve isim ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dosyalar uploads klasörüne kaydedilecek
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Dosya uzantısı alınır
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`; // Benzersiz isim
    cb(null, uniqueName); // Dosya ismi belirlenir
  }
});

const upload = multer({ storage }); // Multer nesnesi oluşturuluyor

module.exports = upload; // Dışa aktarım
