/**
 * HomePage Component
 * 
 * This is the main landing page of the QuizUp application. It provides:
 * - User authentication status check
 * - Navigation to registration and login
 * - Overview of the platform's features
 * - Responsive design with dark mode support
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNotification } from '../contexts/NotificationContext';

function HomePage() {
  // State for storing user data
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Check for existing user session on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

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
        <div className="w-full max-w-xl bg-base dark:bg-base-dark rounded-2xl shadow-lg p-10 flex flex-col items-center border border-neutral dark:border-neutral-dark">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary-dark dark:text-primary text-center">QuizUp ile Canlı Quiz Keyfi!</h1>
          <p className="text-lg md:text-xl mb-6 font-medium text-neutral-dark dark:text-neutral text-center">
            QuizUp, öğretmenler ve öğrenciler için gerçek zamanlı, eğlenceli ve rekabetçi bir quiz platformudur. Hemen kayıt ol, kendi quizini oluştur veya bir quiz'e katıl!
          </p>
          <ul className="mb-8 w-full text-neutral-dark dark:text-neutral text-base list-disc pl-6">
            <li><span role="img" aria-label="tik">✔️</span> Canlı puan tablosu ve anlık rekabet</li>
            <li><span role="img" aria-label="tik">✔️</span> Öğretmenler için kolay quiz oluşturma</li>
            <li><span role="img" aria-label="tik">✔️</span> Öğrenciler için hızlı katılım ve eğlenceli yarışma</li>
            <li><span role="img" aria-label="tik">✔️</span> Modern, mobil uyumlu ve kullanıcı dostu arayüz</li>
          </ul>
          <div className="flex gap-6 flex-col md:flex-row w-full max-w-md justify-center">
            <Link to="/register" className="w-full md:w-auto">
              <button className="w-full md:w-auto py-3 px-8 rounded-2xl bg-primary text-white hover:bg-primary-dark text-lg font-bold shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-light transition-all duration-200">Kayıt Ol</button>
            </Link>
            <Link to="/login" className="w-full md:w-auto">
              <button className="w-full md:w-auto py-3 px-8 rounded-2xl bg-warning text-neutral-dark hover:bg-warning-dark text-lg font-bold shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-warning-light transition-all duration-200">Giriş Yap</button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
