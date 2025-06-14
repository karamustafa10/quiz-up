/**
 * RegisterPage Component
 * 
 * This component handles user registration, providing:
 * - User registration form with username, email, password, and role selection
 * - Form validation and error handling
 * - Loading states during registration
 * - Automatic redirection for authenticated users
 * - Navigation to login
 * - Responsive design with dark mode support
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import Button from '../components/Button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNotification } from '../contexts/NotificationContext';

function RegisterPage() {
  // Navigasyon ve bildirim hook'ları
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Form ve kullanıcı state'leri
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'student' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Kullanıcı oturumunu kontrol et ve yönlendir
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Form input değişikliklerini işle
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Form gönderimini işle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await register(formData);
      if (response.status === 201) {
        showNotification('Kayıt başarılı!', 'success');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setError('Beklenmeyen bir hata oluştu.');
        showNotification('Beklenmeyen bir hata oluştu.', 'error');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt olurken bir hata oluştu.');
      showNotification(err.response?.data?.message || 'Kayıt olurken bir hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Çıkış işlemi
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Profil düzenleme bildirimi
  const handleProfileEdit = () => {
    showNotification('Profil düzenleme sadece panelde yapılabilir.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-primary/10 via-base/60 to-primary-dark/20 dark:from-base-dark dark:via-base-dark/80 dark:to-primary/20 transition-colors duration-700">
      <Header user={user} onLogout={handleLogout} onProfileEdit={handleProfileEdit} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-md bg-base dark:bg-base-dark rounded-2xl shadow-lg p-10 flex flex-col items-center border border-neutral dark:border-neutral-dark">
          <h2 className="text-3xl font-extrabold mb-6 text-primary-dark dark:text-primary text-center">Kayıt Ol</h2>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {/* Kullanıcı adı inputu */}
            <input
              type="text"
              name="username"
              placeholder="Kullanıcı Adı"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full py-3 px-4 rounded-2xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            {/* Email inputu */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-3 px-4 rounded-2xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            {/* Şifre inputu */}
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full py-3 px-4 rounded-2xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            {/* Rol seçimi */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full py-3 px-4 rounded-2xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            >
              <option value="student">Öğrenci</option>
              <option value="teacher">Öğretmen</option>
            </select>
            <Button color="primary" type="submit" className="w-full mt-2" loading={loading} disabled={loading}>Kayıt Ol</Button>
          </form>
          {error && <p className="text-danger font-semibold mt-4 text-center">{error}</p>}
          <div className="mt-6 text-sm text-neutral-dark/80 dark:text-neutral/70">
            Zaten hesabın var mı?{' '}
            <span className="underline cursor-pointer text-primary hover:text-primary-dark dark:text-primary-light" onClick={() => navigate('/login')}>Giriş Yap</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RegisterPage;
