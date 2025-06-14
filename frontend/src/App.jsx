import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CreateQuizPage from './pages/CreateQuizPage';
import JoinQuizPage from './pages/JoinQuizPage';
import NotFoundPage from './pages/NotFoundPage';
import Notification from './components/Notification';
import { useNotification } from './contexts/NotificationContext';
import AboutPage from './pages/AboutPage';

function App() {
  const { notification, closeNotification } = useNotification();
  return (
    <Router>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-quiz" element={<CreateQuizPage />} />
        <Route path="/join-quiz" element={<JoinQuizPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
