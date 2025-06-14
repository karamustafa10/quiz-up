import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import { useNotification } from '../contexts/NotificationContext';

function MyQuizHistory() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/results/my-history', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setResults(res.data))
    .catch(err => {
      console.error('Quiz geçmişi alınamadı:', err);
    })
    .finally(() => setLoading(false));
  }, []);

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
        <div className="w-full max-w-2xl">
          <Card className="flex flex-col items-center">
            <h2 className="text-3xl font-extrabold mb-6 text-primary-dark dark:text-primary text-center">Quiz Geçmişim</h2>
            {loading ? (
              <div className="flex justify-center my-8"><Loader size={10} /></div>
            ) : results.length === 0 ? (
              <p className="text-neutral-dark dark:text-neutral text-lg text-center">Henüz quiz geçmişiniz bulunmuyor.</p>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                {results.map(r => (
                  <Card key={r._id} className="w-full bg-neutral dark:bg-base-dark border border-neutral-dark/10 dark:border-neutral-dark/30 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-primary-dark dark:text-primary">{r.quizId ? r.quizId.title : 'Quiz Silinmiş'}</h3>
                      <div className="flex flex-wrap gap-3 items-center text-neutral-dark dark:text-neutral">
                        <Badge color="success">Puan: {r.score}</Badge>
                        {r.quizId && <Badge color="primary">Soru: {r.totalQuestions}</Badge>}
                        <span className="text-sm text-neutral-dark/70 dark:text-neutral/70">{new Date(r.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MyQuizHistory;
