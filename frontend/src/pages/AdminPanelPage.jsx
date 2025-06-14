import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Grafikler için tema algılayıcı yardımcı fonksiyon
const getIsDarkMode = () => document.documentElement.classList.contains('dark');

function AdminPanelPage() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [quizSortOrder, setQuizSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(getIsDarkMode());
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  const { notification, showNotification, closeNotification } = useNotification();
  const navigate = useNavigate();
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    const observer = new MutationObserver(() => {
      setIsDarkMode(getIsDarkMode());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const chartTextColor = isDarkMode ? '#fff' : '#222';
  const chartGridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  const handleDeleteUser = async (id) => {
    setConfirmDialog({
      open: true,
      message: 'Bu kullanıcıyı silmek istediğinize emin misiniz?',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, open: false });
        try {
          setLoading(true);
          await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(prev => prev.filter(user => user._id !== id));
          showNotification('Kullanıcı başarıyla silindi.', 'success');
        } catch (err) {
          showNotification('Kullanıcı silinemedi.', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDeleteQuiz = async (id) => {
    setConfirmDialog({
      open: true,
      message: "Bu quiz'i silmek istediğinize emin misiniz?",
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, open: false });
        try {
          setLoading(true);
          await axios.delete(`http://localhost:5000/api/admin/quiz/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setQuizzes(prev => prev.filter(quiz => quiz._id !== id));
          showNotification('Quiz başarıyla silindi.', 'success');
        } catch (err) {
          showNotification('Quiz silinemedi.', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    if (tab === 'users') {
      axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUsers(res.data)).finally(() => setLoading(false));
    } else if (tab === 'quizzes') {
      axios.get('http://localhost:5000/api/admin/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setQuizzes(res.data)).finally(() => setLoading(false));
    } else if (tab === 'analytics') {
      axios.get('http://localhost:5000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setAnalytics(res.data)).finally(() => setLoading(false));
    }
  }, [tab, token]);

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
        <div className="w-full max-w-3xl">
          <Card className="flex flex-col items-center">
            <h2 className="text-3xl font-extrabold mb-6 text-primary-dark dark:text-primary text-center">🔐 Admin Paneli</h2>
            {/* Sekmeler */}
            <div className="flex gap-4 mb-8 w-full justify-center">
              <Button color={tab === 'users' ? 'primary' : 'neutral'} className="w-32" onClick={() => setTab('users')}>Kullanıcılar</Button>
              <Button color={tab === 'quizzes' ? 'primary' : 'neutral'} className="w-32" onClick={() => setTab('quizzes')}>Quizler</Button>
              <Button color={tab === 'analytics' ? 'primary' : 'neutral'} className="w-32" onClick={() => setTab('analytics')}>Analiz</Button>
            </div>
            {/* İçerikler */}
            {loading && <div className="flex justify-center my-8"><Loader size={10} /></div>}
            {!loading && tab === 'users' && (
              <>
                <input
                  type="text"
                  placeholder="Kullanıcı adı veya e-posta ara"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="py-2 px-4 rounded-xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light mb-4 w-full max-w-md"
                />
                <ul className="flex flex-col gap-3 w-full">
                  {users
                    .filter(user =>
                      user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
                      user.email.toLowerCase().includes(userSearch.toLowerCase())
                    )
                    .map(user => (
                      <li key={user._id} className="flex flex-col md:flex-row md:items-center justify-between bg-neutral dark:bg-base-dark rounded-xl p-4 border border-neutral-dark/10 dark:border-neutral-dark/30 shadow-sm gap-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <span className="font-bold text-primary-dark dark:text-primary">{user.username}</span>
                          <span className="text-neutral-dark dark:text-neutral">{user.email}</span>
                          <Badge color={user.role === 'admin' ? 'danger' : (user.role === 'teacher' ? 'accent' : 'primary')}>{user.role}</Badge>
                        </div>
                        <Button color="danger" size="md" onClick={() => handleDeleteUser(user._id)}>Sil</Button>
                      </li>
                    ))}
                </ul>
              </>
            )}
            {!loading && tab === 'quizzes' && (
              <>
                <div className="flex flex-col md:flex-row gap-2 w-full mb-4">
                  <input
                    type="text"
                    placeholder="Quiz başlığı ara"
                    value={quizSearch}
                    onChange={(e) => setQuizSearch(e.target.value)}
                    className="py-2 px-4 rounded-xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light w-full md:w-80"
                  />
                  <Button
                    color="accent"
                    size="md"
                    className="md:ml-2"
                    onClick={() => setQuizSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  >
                    Sorulara Göre Sırala ({quizSortOrder === 'asc' ? 'Artan' : 'Azalan'})
                  </Button>
                </div>
                <ul className="flex flex-col gap-3 w-full">
                  {quizzes
                    .filter(q => q.title.toLowerCase().includes(quizSearch.toLowerCase()))
                    .sort((a, b) => {
                      const lenA = a.questions?.length || 0;
                      const lenB = b.questions?.length || 0;
                      return quizSortOrder === 'asc' ? lenA - lenB : lenB - lenA;
                    })
                    .map(quiz => (
                      <li key={quiz._id} className="flex flex-col md:flex-row md:items-center justify-between bg-neutral dark:bg-base-dark rounded-xl p-4 border border-neutral-dark/10 dark:border-neutral-dark/30 shadow-sm gap-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <span className="font-bold text-primary-dark dark:text-primary">{quiz.title}</span>
                          <span className="text-neutral-dark dark:text-neutral">Hazırlayan: {quiz.createdBy?.username || 'Bilinmiyor'}</span>
                          <Badge color="success">{quiz.questions?.length || 0} soru</Badge>
                        </div>
                        <Button color="danger" size="md" onClick={() => handleDeleteQuiz(quiz._id)}>Sil</Button>
                      </li>
                    ))}
                </ul>
              </>
            )}
            {!loading && tab === 'analytics' && analytics && (
              <div className="w-full flex flex-col items-center">
                <h3 className="text-xl font-bold mb-4 text-primary-dark dark:text-primary">Genel Analiz</h3>
                <div className="mb-8 w-full">
                  <Bar
                    data={{
                      labels: ['Kullanıcılar', 'Quizler', 'Oturumlar'],
                      datasets: [
                        {
                          label: 'Toplam',
                          data: [analytics.totalUsers, analytics.totalQuizzes, analytics.totalSessions],
                          backgroundColor: ['#3498db', '#2ecc71', '#e67e22']
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        title: { color: chartTextColor },
                      },
                      scales: {
                        x: {
                          ticks: { color: chartTextColor },
                          grid: { color: chartGridColor },
                        },
                        y: {
                          ticks: { color: chartTextColor },
                          grid: { color: chartGridColor },
                        }
                      },
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
                <div className="w-full max-w-xs mx-auto">
                  <Pie
                    data={{
                      labels: ['Ortalama Puan', `Max: 100 - Kalan`],
                      datasets: [
                        {
                          data: [analytics.averageScore, 100 - analytics.averageScore],
                          backgroundColor: ['#9b59b6', '#ecf0f1']
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          labels: { color: chartTextColor }
                        },
                        title: { color: chartTextColor },
                      },
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <ConfirmDialog
        open={confirmDialog.open}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </div>
  );
}

export default AdminPanelPage;
