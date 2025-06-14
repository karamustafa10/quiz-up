// src/socket.js
import { io } from 'socket.io-client';

// Kullanıcı bilgisini localStorage'dan al
const user = JSON.parse(localStorage.getItem('user'));

// Socket bağlantısı oluştur
const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  auth: {
    username: user?.username || 'Bilinmeyen Kullanıcı'
  }
});

// Socket nesnesini dışa aktar
export default socket;
