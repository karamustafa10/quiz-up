import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Tema değiştirme butonu fonksiyonu
export default function ThemeToggle() {
  // Tema ve tema değiştirme fonksiyonunu context'ten al
  const { theme, toggleTheme } = useTheme();

  return (
    // Temayı değiştiren buton
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-neutral/10 dark:bg-neutral-dark/10 text-neutral-dark dark:text-neutral hover:bg-neutral/20 dark:hover:bg-neutral-dark/20 transition-colors"
      title={theme === 'dark' ? 'Aydınlık Temaya Geç' : 'Karanlık Temaya Geç'}
    >
      {/* Tema durumuna göre ikon değiştir */}
      {theme === 'dark' ? (
        // Güneş ikonu (aydınlık tema için)
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // Ay ikonu (karanlık tema için)
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
} 