import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useNotification } from '../contexts/NotificationContext';

function JoinQuizPage() {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!joinCode) {
      setError('Lütfen katılım kodu girin.');
      showNotification('Lütfen katılım kodu girin.', 'warning');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/quiz/join/${joinCode}`);
      if (response.status === 200) {
        const { sessionId, quiz } = response.data;
        localStorage.setItem('currentQuiz', JSON.stringify(quiz));
        localStorage.setItem('sessionId', sessionId);
        showNotification('Quiz lobisine yönlendiriliyorsunuz...', 'success');
        setTimeout(() => navigate(`/quiz-lobby/${sessionId}`), 1200);
      }
    } catch (err) {
      setError('Geçersiz veya bulunamayan katılım kodu.');
      showNotification('Geçersiz veya bulunamayan katılım kodu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileEdit = () => {
    showNotification('Profil düzenleme sadece panelde yapılabilir.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-primary/10 via-base/60 to-primary-dark/20 dark:from-base-dark dark:via-base-dark/80 dark:to-primary/20 transition-colors duration-700">
      <Header user={user} onLogout={handleLogout} onProfileEdit={handleProfileEdit} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-md bg-base dark:bg-base-dark rounded-2xl shadow-lg p-10 flex flex-col items-center border border-neutral dark:border-neutral-dark">
          <h2 className="text-3xl font-extrabold mb-6 text-primary-dark dark:text-primary text-center">Quiz'e Katıl</h2>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <input
              type="text"
              placeholder="Katılım Kodu"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              required
              className="w-full py-3 px-4 rounded-2xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-warning-light"
            />
            <Button color="warning" type="submit" className="w-full mt-2" loading={loading} disabled={loading}>Katıl</Button>
          </form>
          {error && <p className="text-danger font-semibold mt-4 text-center">{error}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default JoinQuizPage;
