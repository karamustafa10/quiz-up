import React, { useEffect } from "react";

// Bildirim tiplerine göre stil tanımları
const typeStyles = {
  success: "bg-green-100 border-green-400 text-green-700 dark:bg-success-dark dark:border-success-dark dark:text-white",
  error: "bg-red-100 border-red-400 text-red-700 dark:bg-danger-dark dark:border-danger-dark dark:text-white",
  info: "bg-blue-100 border-blue-400 text-blue-700 dark:bg-accent-dark dark:border-accent-dark dark:text-white",
  warning: "bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-warning-dark dark:border-warning-dark dark:text-white",
};

// Bildirim fonksiyonu
export default function Notification({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) {
  // Otomatik kapanma için timer
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    // Bildirim kutusu
    <div
      className={`fixed top-5 right-5 z-50 px-6 py-4 border-l-4 rounded shadow-lg flex items-center gap-3 animate-slide-in opacity-95 ${
        typeStyles[type] || typeStyles.info
      }`}
      role="alert"
    >
      <span className="flex-1">{message}</span>
      {/* Kapatma butonu */}
      <button
        onClick={onClose}
        className="ml-4 text-xl font-bold focus:outline-none opacity-80 hover:opacity-100"
        aria-label="Kapat"
      >
        ×
      </button>
    </div>
  );
}

// Tailwind animasyonu için ek CSS (index.css veya global css'e eklenmeli):
// .animate-slide-in { animation: slide-in 0.3s cubic-bezier(0.4,0,0.2,1); }
// @keyframes slide-in { from { opacity:0; transform: translateY(-20px);} to { opacity:1; transform: none; } } 