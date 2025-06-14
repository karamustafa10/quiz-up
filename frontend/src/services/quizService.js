import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quiz'; // Backend route'umuz bu olacak

export const createQuiz = (quizData) => {
  const token = localStorage.getItem('token');

  return axios.post(`${API_URL}/create`, quizData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
