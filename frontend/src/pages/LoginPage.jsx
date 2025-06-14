/**
 * LoginPage Component
 * 
 * This component handles user authentication, providing:
 * - Email and password login form
 * - Form validation and error handling
 * - Loading states during authentication
 * - Automatic redirection for authenticated users
 * - Navigation to registration
 * - Responsive design with dark mode support
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import Button from '../components/Button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useNotification } from '../contexts/NotificationContext';

function LoginPage() {
  // Navigation and notification hooks
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Component state management
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing user session and redirect if authenticated
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission and authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(formData);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        showNotification('Giriş başarılı!', 'success');
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setError('Beklenmeyen bir hata oluştu.');
        showNotification('Beklenmeyen bir hata oluştu.', 'error');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş yaparken bir hata oluştu.');
      showNotification(err.response?.data?.message || 'Giriş yaparken bir hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle profile edit notification
  const handleProfileEdit = () => {
    showNotification('Profil düzenleme sadece panelde yapılabilir.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-primary/10 via-base/60 to-primary-dark/20 dark:from-base-dark dark:via-base-dark/80 dark:to-primary/20 transition-colors duration-700">
      <Header user={user} onLogout={handleLogout} onProfileEdit={handleProfileEdit} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-md bg-base dark:bg-base-dark rounded-2xl shadow-lg p-10 flex flex-col items-center border border-neutral dark:border-neutral-dark">
          <h2 className="text-3xl font-extrabold mb-6 text-primary-dark dark:text-primary text-center">Giriş Yap</h2>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-3 px-4 rounded-2xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full py-3 px-4 rounded-2xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <Button color="warning" type="submit" className="w-full mt-2" loading={loading} disabled={loading}>Giriş Yap</Button>
          </form>
          {error && <p className="text-danger font-semibold mt-4 text-center">{error}</p>}
          <div className="mt-6 text-sm text-neutral-dark/80 dark:text-neutral/70">
            Hesabın yok mu?{' '}
            <span className="underline cursor-pointer text-primary hover:text-primary-dark dark:text-primary-light" onClick={() => navigate('/register')}>Kayıt Ol</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;