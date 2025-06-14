import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

function Header({ user, onLogout, onProfileEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogoClick = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="w-full bg-base/80 dark:bg-base-dark/80 text-primary-dark dark:text-primary border-b border-neutral dark:border-neutral-dark shadow-md shadow-black/10 py-3 px-6 flex items-center justify-between rounded-b-2xl backdrop-blur-md transition-all duration-300">
      <div className="flex items-center gap-6">
        <button onClick={handleLogoClick} className="text-2xl font-extrabold tracking-tight bg-transparent border-none outline-none cursor-pointer">QuizUp</button>
        <Link to="/about" className="text-base font-medium text-neutral-dark dark:text-neutral hover:text-primary transition-colors">Hakkında</Link>
      </div>
      <nav className="flex items-center gap-2 relative">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        {user && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg focus:outline-none border-2 border-primary-dark hover:scale-105 transition-transform"
                title="Profil Menüsü"
              >
                {user.username?.[0]?.toUpperCase() || '?'}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-base-dark border border-neutral dark:border-neutral-dark rounded-lg shadow-lg z-50 animate-slide-in">
                  <div className="px-4 py-2 text-neutral-dark dark:text-neutral font-semibold border-b border-neutral dark:border-neutral-dark">{user.username}</div>
                  <button className="w-full text-left px-4 py-2 hover:bg-neutral/30 dark:hover:bg-neutral-dark/30" onClick={onProfileEdit}>Profili Düzenle</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-danger/20 dark:hover:bg-danger-dark/20 text-danger dark:text-danger-light" onClick={onLogout}>Çıkış Yap</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header; 