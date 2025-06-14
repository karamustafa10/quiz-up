// Yükleniyor animasyonu (spinner) bileşeni
import React from 'react';

// Loader fonksiyonu
export default function Loader({ size = 8 }) {
  return (
    // Dönen yükleniyor simgesi
    <div className={`w-${size} h-${size} border-4 border-primary border-t-transparent rounded-full animate-spin`}></div>
  );
} 