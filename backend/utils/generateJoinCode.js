// Katılım kodu üretmek için yardımcı fonksiyon
// Belirtilen uzunlukta büyük harf ve rakamlardan oluşan rastgele bir kod üretir
function generateJoinCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Kullanılacak karakterler
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length)); // Rastgele karakter ekle
  }
  return code; // Oluşturulan kodu döndür
}

module.exports = generateJoinCode; // Fonksiyonu dışa aktar
  