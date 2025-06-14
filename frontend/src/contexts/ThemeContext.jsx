/**
 * ThemeContext
 * 
 * Bu context, uygulamanın tema yönetimini sağlar.
 * Kullanıcının tercih ettiği tema (açık/koyu) localStorage'da saklanır
 * ve sayfa yenilendiğinde korunur.
 * Tema değişikliği, HTML elementine 'dark' class'ı ekleyerek/çıkararak
 * CSS değişkenlerini etkiler.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

// Tema sağlayıcı fonksiyonu
export function ThemeProvider({ children }) {
  // Tema state'i (localStorage'dan alınır veya varsayılan 'light')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Tema değiştiğinde localStorage ve HTML class güncellemesi
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Tema değiştirici fonksiyon
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Tema context'ini kullanan hook
export function useTheme() {
  return useContext(ThemeContext);
} 