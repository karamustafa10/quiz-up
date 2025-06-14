// Genel amaçlı kart (container) bileşeni
import React from 'react';

// Card fonksiyonu
export default function Card({ children, className = '' }) {
  return (
    // Kart kutusu
    <div className={`bg-base dark:bg-base-dark rounded-2xl shadow-lg p-6 border border-neutral dark:border-neutral-dark text-neutral-dark dark:text-neutral ${className}`}>{children}</div>
  );
} 