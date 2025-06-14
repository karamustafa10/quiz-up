/**
 * NotificationContext
 * 
 * Bu context, uygulama genelinde bildirim göstermek için kullanılır.
 * Bildirimler info, success, error gibi farklı tiplerde olabilir
 * ve belirli bir süre sonra otomatik olarak kapanır.
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext();

// Bildirim sağlayıcı fonksiyonu
export function NotificationProvider({ children }) {
  // Bildirim state'i
  const [notification, setNotification] = useState(null);
  const timerRef = useRef();

  // Bildirim gösterme fonksiyonu
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (duration) {
      timerRef.current = setTimeout(() => {
        setNotification(null);
        timerRef.current = null;
      }, duration);
    }
  }, []);

  // Bildirimi kapatma fonksiyonu
  const closeNotification = () => {
    setNotification(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Unmount olduğunda timer'ı temizle
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

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