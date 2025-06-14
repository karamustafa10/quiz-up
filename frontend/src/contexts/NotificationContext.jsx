/**
 * NotificationContext
 * 
 * Bu context, uygulama genelinde bildirim göstermek için kullanılır.
 * Bildirimler info, success, error gibi farklı tiplerde olabilir
 * ve belirli bir süre sonra otomatik olarak kapanır.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    if (duration) {
      setTimeout(() => setNotification(null), duration);
    }
  }, []);

  const closeNotification = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, closeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
} 