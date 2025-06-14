/**
 * AboutPage Component
 * 
 * This page provides information about the QuizUp platform, including:
 * - Platform overview and features
 * - How to play guide
 * - User authentication status
 * - Responsive design with animations
 */

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  // Kullanıcı state'i
  const [user, setUser] = useState(null);

  // Kullanıcı oturumunu kontrol et
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  // Çıkış işlemi
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Profil düzenleme bildirimi
  const handleProfileEdit = () => {
    alert('Profil düzenleme sadece panelde yapılabilir.');
  };

  // Platform kullanım rehberi
  const howToPlay = [
    { emoji: '📝', text: 'Kayıt ol veya giriş yap.' },
    { emoji: '👩‍🏫', text: 'Öğretmensen yeni bir quiz oluştur, sorular ekle ve başlat.' },
    { emoji: '🎟️', text: 'Öğrenciysen davet kodu ile quiz\'e katıl.' },
    { emoji: '🔍', text: 'Soruları dikkatlice oku ve doğru cevabı seç.' },
    { emoji: '⏰', text: 'Süre bitiminde veya herkes cevapladığında, doğru cevap ve puanlar açıklanır.' },
    { emoji: '🏆', text: 'Quiz sonunda genel puan tablosu ile sıralamanı gör!' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-primary/10 via-base/60 to-primary-dark/20 dark:from-base-dark dark:via-base-dark/80 dark:to-primary/20 transition-colors duration-700">
      <Header user={user} onLogout={handleLogout} onProfileEdit={handleProfileEdit} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-2xl bg-base/80 dark:bg-base-dark/80 rounded-2xl shadow-2xl p-10 flex flex-col items-center border border-neutral dark:border-neutral-dark animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary-dark dark:text-primary text-center flex items-center gap-2 animate-bounce-slow">🎉 QuizUp Hakkında</h1>
          <p className="text-lg md:text-xl mb-6 font-medium text-neutral-dark dark:text-neutral text-center animate-fade-in delay-100">
            <b>QuizUp</b> <span className="inline-block">🚀</span>, öğretmenler ve öğrenciler için geliştirilmiş, canlı ve etkileşimli bir quiz platformudur. Gerçek zamanlı yarışmalar, anlık puan tablosu ve eğlenceli rekabet ortamı sunar.
          </p>
          {/* Platform özellikleri */}
          <ul className="mb-8 w-full text-neutral-dark dark:text-neutral text-base list-disc pl-6 space-y-2">
            <li className="transition-transform duration-300 hover:scale-105">👩‍🏫 <b>Öğretmenler</b> kolayca quiz oluşturabilir, sorular ekleyebilir ve öğrencileri davet edebilir.</li>
            <li className="transition-transform duration-300 hover:scale-105">🧑‍🎓 <b>Öğrenciler</b> hızlıca quizlere katılır, soruları cevaplar ve puan toplar.</li>
            <li className="transition-transform duration-300 hover:scale-105">⏱️ Her soru için süre bulunur, cevaplar anlık olarak değerlendirilir.</li>
            <li className="transition-transform duration-300 hover:scale-105">📊 Canlı puan tablosu ile yarışmacılar anlık sıralamalarını görebilir.</li>
            <li className="transition-transform duration-300 hover:scale-105">📱 Modern, mobil uyumlu ve kullanıcı dostu arayüz ile kolay kullanım.</li>
          </ul>
          <h2 className="text-2xl font-bold mb-4 text-primary-dark dark:text-primary flex items-center gap-2 animate-fade-in delay-200">🤔 Nasıl Oynanır?</h2>
          {/* Kullanım rehberi adımları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full">
            {howToPlay.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-neutral/10 dark:bg-neutral-dark/20 rounded-xl p-4 shadow-md transition-transform duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${0.1 * idx}s` }}
              >
                <span className="text-2xl md:text-3xl">{step.emoji}</span>
                <span className="text-base md:text-lg font-medium text-neutral-dark dark:text-neutral">{step.text}</span>
              </div>
            ))}
          </div>
          <div className="w-full text-center text-neutral-dark dark:text-neutral text-base animate-fade-in delay-300">
            <b>QuizUp</b> ile öğrenmeyi ve yarışmayı bir arada yaşa! <span className="inline-block">✨</span>
          </div>
        </div>
      </main>
      <Footer />
      {/* Animasyonlar için stil */}
      <style>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.8s forwards;
        }
        .animate-fade-in.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in.delay-300 { animation-delay: 0.3s; }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2.5s infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
} 