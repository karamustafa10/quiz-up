# QuizUp

## Proje Tanımı
QuizUp, öğretmenler ve öğrenciler için gerçek zamanlı, eğlenceli ve rekabetçi bir quiz platformudur. Öğretmenler kolayca quiz oluşturabilir, öğrenciler ise hızlıca katılıp canlı puan tablosunda yarışabilir. Modern ve kullanıcı dostu arayüzüyle eğitimde etkileşimi artırmayı hedefler.

## Özellikler
- Gerçek zamanlı quiz ve canlı skor tablosu (Socket.io ile)
- Öğretmenler için quiz oluşturma ve yönetme
- Öğrenciler için hızlı katılım ve yarışma
- Admin paneli ile kullanıcı ve quiz yönetimi
- Kapsamlı quiz geçmişi ve analizler
- Medya (resim/video) destekli sorular
- Karanlık mod ve mobil uyumlu arayüz

## Kullanılan Teknolojiler
### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- Socket.io (gerçek zamanlı iletişim)
- JWT ile kimlik doğrulama
- Multer (dosya yükleme)
- dotenv, bcryptjs, cors

### Frontend
- React.js (Create React App tabanlı)
- React Router
- Axios (API iletişimi)
- Chart.js (istatistikler)
- TailwindCSS (modern arayüz)
- Socket.io-client

## Kurulum ve Çalıştırma
### Gereksinimler
- Node.js (v16+ önerilir)
- MongoDB (lokal veya bulut)

### Adımlar
1. **Projeyi klonlayın:**
   ```bash
   git clone <repo-url>
   cd quiz-up
   ```
2. **Backend kurulumu:**
   ```bash
   cd backend
   npm install
   # .env dosyası oluşturun ve MONGO_URI ile JWT_SECRET değerlerini girin
   npm run dev
   ```
3. **Frontend kurulumu:**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
4. **Uygulama:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Kullanıcı Rolleri ve Akış
- **Öğretmen:** Quiz oluşturur, oturum başlatır, canlı olarak yönetir.
- **Öğrenci:** Kodu ile quiz'e katılır, soruları cevaplar, anlık skorunu görür.
- **Admin:** Kullanıcı ve quiz yönetimi, genel analizler.

## API ve Gerçek Zamanlı Özellikler
- RESTful API ile kullanıcı, quiz, oturum ve sonuç yönetimi
- Socket.io ile canlı quiz akışı, skor tablosu ve anlık bildirimler
- JWT tabanlı kimlik doğrulama

## Klasör Yapısı (Özet)
```
quiz-up/
├── backend/
│   ├── controllers/    # İş mantığı
│   ├── middleware/     # Orta katmanlar (auth, admin)
│   ├── models/         # Mongoose modelleri
│   ├── routes/         # API uç noktaları
│   ├── utils/          # Yardımcı fonksiyonlar
│   └── server.js       # Ana sunucu dosyası
├── frontend/
│   ├── src/
│   │   ├── components/ # React bileşenleri
│   │   ├── contexts/   # Global state/context
│   │   ├── pages/      # Sayfa bileşenleri
│   │   ├── services/   # API servisleri
│   │   └── App.js      # Ana uygulama
│   └── public/
└── README.md
```

## Katkı Sağlama
Katkı sağlamak için lütfen bir fork oluşturun, değişikliklerinizi yeni bir branch'te yapın ve pull request gönderin.

## Lisans
Bu proje [MIT Lisansı](./LICENSE) ile lisanslanmıştır. © 2024 Semih KARAMUSTAFA - MUSTAFA SEMİH BULUT