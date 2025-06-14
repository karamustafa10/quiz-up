// Genel amaçlı modal (açılır pencere) bileşeni
import React from 'react';

// Modal fonksiyonu
export default function Modal({ open, onClose, children }) {
  // Modal açık değilse hiçbir şey render etme
  if (!open) return null;
  return (
    // Modal arka planı ve içerik kutusu
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70">
      <div className="bg-white dark:bg-base-dark rounded-xl shadow-lg p-6 min-w-[300px] relative text-neutral-dark dark:text-neutral">
        {/* Kapatma butonu */}
        <button className="absolute top-2 right-2 text-xl dark:text-neutral" onClick={onClose}>×</button>
        {/* Modal içeriği */}
        {children}
      </div>
    </div>
  );
} 