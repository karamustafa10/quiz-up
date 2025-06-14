// Kimlik doğrulama servis fonksiyonları
import axios from 'axios';

// API ana URL'i
const API_URL = 'http://localhost:5000/api/auth';

// Kayıt olma fonksiyonu
export const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

// Giriş yapma fonksiyonu
export const login = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};
