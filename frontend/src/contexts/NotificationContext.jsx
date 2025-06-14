/**
 * NotificationContext
 * 
 * Bu context, uygulama genelinde bildirim göstermek için kullanılır.
 * Bildirimler info, success, error gibi farklı tiplerde olabilir
 * ve belirli bir süre sonra otomatik olarak kapanır.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

// Bildirim sağlayıcı fonksiyonu
export function NotificationProvider({ children }) {
  // Bildirim state'i
  const [notification, setNotification] = useState(null);

  // Bildirim gösterme fonksiyonu
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    if (duration) {
      setTimeout(() => setNotification(null), duration);
    }
  }, []);

  // Bildirimi kapatma fonksiyonu
  const closeNotification = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, closeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Notification context'ini kullanan hook
export function useNotification() {
  return useContext(NotificationContext);
} 