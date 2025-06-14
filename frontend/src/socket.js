// src/socket.js
import { io } from 'socket.io-client';

const user = JSON.parse(localStorage.getItem('user'));

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  auth: {
    username: user?.username || 'Bilinmeyen Kullanıcı'
  }
});

export default socket;
