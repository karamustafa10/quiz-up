// Quiz seçme ve başlatma sayfası (öğretmenler için)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import Header from '../components/Header';
import Footer from '../components/Footer';

function SelectQuizPage() {
  // State ve hook'lar
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Kullanıcı ve quiz listesini yükle
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/quiz/my-quizzes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuizzes(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Quiz başlatma işlemi
  const handleStartSession = async (quiz) => {
    try {
      const token = localStorage.getItem('token');
      localStorage.setItem('currentQuiz', JSON.stringify(quiz));
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/session/start`,
        { quizId: quiz._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sessionId = response.data.sessionId;
      navigate(`/quiz-lobby/${sessionId}`);
    } catch (err) {}
  };

  // Çıkış işlemi
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Profil düzenleme bildirimi
  const handleProfileEdit = () => {
    alert('Profil düzenleme sadece panelde yapılabilir.');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-primary/10 via-base/60 to-primary-dark/20 dark:from-base-dark dark:via-base-dark/80 dark:to-primary/20 transition-colors duration-700">
      <Header user={user} onLogout={handleLogout} onProfileEdit={handleProfileEdit} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-2xl bg-base dark:bg-base-dark rounded-2xl shadow-lg p-10 flex flex-col items-center border border-neutral dark:border-neutral-dark">
          <h2 className="text-3xl font-extrabold mb-8 text-primary-dark dark:text-primary text-center">Quiz Seçimi</h2>
          {/* Quiz listesi */}
          {loading ? (
            <p className="text-neutral-dark dark:text-neutral text-center">Yükleniyor...</p>
          ) : quizzes.length === 0 ? (
            <p className="text-neutral-dark dark:text-neutral text-center">Hiç quiz oluşturulmamış.</p>
          ) : (
            <div className="flex flex-col gap-6 w-full">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-neutral dark:bg-base-dark rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm border border-neutral-dark/10 dark:border-neutral-dark/30">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-primary-dark dark:text-primary">{quiz.title}</h3>
                    <p className="text-neutral-dark dark:text-neutral">Sorular: {quiz.questions.length}</p>
                  </div>
                  <Button color="success" className="w-full md:w-auto" onClick={() => handleStartSession(quiz)}>
                    Başlat
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SelectQuizPage;
