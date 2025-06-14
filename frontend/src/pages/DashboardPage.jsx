/**
 * DashboardPage Component
 * 
 * This component serves as the main dashboard for all user types, providing:
 * - Role-based dashboard content (Teacher, Student, Admin)
 * - User profile management
 * - Authentication state management
 * - Profile editing modal
 * - Responsive design with dark mode support
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { useNotification } from '../contexts/NotificationContext';
import TeacherDashboard from '../components/TeacherDashboard';
import StudentDashboard from '../components/StudentDashboard';
import AdminDashboard from '../components/AdminDashboard';

function DashboardPage() {
  // Navigation and notification hooks
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Component state management
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(false);

  // Check authentication and load user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setProfileData({ username: userData.username, email: userData.email });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Open profile edit modal
  const handleProfileEdit = () => {
    setModalOpen(true);
  };

  // Handle profile form input changes
  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle profile form submission
  const handleProfileSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setUser((prev) => ({ ...prev, ...profileData }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...profileData }));
      setLoading(false);
      setModalOpen(false);
      showNotification('Profil başarıyla güncellendi!', 'success');
    }, 1000);
  };

  // Show loading state while user data is being fetched
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen"><Loader size={12} /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-primary/10 via-base/60 to-primary-dark/20 dark:from-base-dark dark:via-base-dark/80 dark:to-primary/20 transition-colors duration-700">
      <Header user={user} onLogout={handleLogout} onProfileEdit={handleProfileEdit} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-2xl bg-base dark:bg-base-dark rounded-2xl shadow-lg p-10 flex flex-col items-center border border-neutral dark:border-neutral-dark">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-primary-dark dark:text-primary">Hoşgeldin, {user.username}!</h1>
          <p className="text-lg md:text-xl mb-4 font-medium text-neutral-dark dark:text-neutral">Rolün: <span className="font-bold text-primary dark:text-primary-light">{user.role === 'teacher' ? 'Öğretmen' : user.role === 'admin' ? 'Admin' : 'Öğrenci'}</span></p>
          {/* Rol bazlı dashboard içerikleri */}
          {user.role === 'teacher' && <TeacherDashboard />}
          {user.role === 'student' && <StudentDashboard />}
          {user.role === 'admin' && <AdminDashboard />}
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-primary-dark dark:text-primary">Profili Düzenle</h2>
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              className="py-2 px-4 rounded-xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
              required
              placeholder="Kullanıcı Adı"
            />
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="py-2 px-4 rounded-xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
              required
              placeholder="Email"
            />
            <Button color="primary" type="submit" loading={loading} disabled={loading}>Kaydet</Button>
          </form>
        </Modal>
      </main>
      <Footer />
    </div>
  );
}

export default DashboardPage;
