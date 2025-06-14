import React from 'react';

// Footer fonksiyonu
function Footer() {
  return (
    // Alt bilgi içeriği
    <footer className="w-full bg-base/80 dark:bg-base-dark/80 dark:text-neutral border-t border-neutral dark:border-neutral-dark shadow-md shadow-black/10 py-7 px-6 flex flex-col md:flex-row items-center justify-between mt-8 gap-4 rounded-t-2xl backdrop-blur-md transition-all duration-300">
      <div id="about-quizup" className="max-w-lg text-sm md:text-base">
        <span className="font-bold text-primary">QuizUp</span>
        <span className="text-gray-600 dark:text-white inline"> — Canlı, etkileşimli quiz platformu. Öğretmenler quiz oluşturur, öğrenciler anlık katılır ve yarışır. Gerçek zamanlı puan tablosu ve eğlenceli rekabet deneyimi sunar.</span>
      </div>
      <span className="mt-2 text-xs text-neutral-dark/60 dark:text-neutral/60">© {new Date().getFullYear()} QuizUp. Tüm hakları saklıdır.</span>
    </footer>
  );
}

export default Footer; 