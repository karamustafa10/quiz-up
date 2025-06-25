import axios from 'axios';

// Quiz ile ilgili servis fonksiyonları

// API ana URL'i
const API_URL = process.env.REACT_APP_API_URL + '/api/quiz'; // Backend route'umuz bu olacak

// Quiz oluşturma fonksiyonu
export const createQuiz = (quizData) => {
  const token = localStorage.getItem('token');

  return axios.post(`${API_URL}/create`, quizData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
