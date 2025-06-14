// Uygulamanın ana router ve sayfa yönlendirme dosyası
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateQuizPage from './pages/CreateQuizPage';
import JoinQuizPage from './pages/JoinQuizPage';
import SelectQuizPage from './pages/SelectQuizPage';
import TeacherLobbyPage from './pages/TeacherLobbyPage';
import StudentLobbyPage from './pages/StudentLobbyPage';
import LiveQuizTeacherPage from './pages/LiveQuizTeacherPage';
import LiveQuizStudentPage from './pages/LiveQuizStudentPage';
import MyQuizHistoryPage from './pages/MyQuizHistoryPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AboutPage from './pages/AboutPage';

function App() {
  // Kullanıcı bilgisini localStorage'dan al
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    // Tüm uygulama için router ve route tanımları
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-quiz" element={<CreateQuizPage />} />
        <Route path="/join-quiz" element={<JoinQuizPage />} />
        <Route path="/select-quiz" element={<SelectQuizPage />} />
        {/* Quiz lobisi, kullanıcı rolüne göre yönlendirme */}
        <Route path="/quiz-lobby/:sessionId" element={
          user?.role === 'teacher'
            ? <TeacherLobbyPage />
            : <StudentLobbyPage />
        } />
        {/* Canlı quiz ekranı, kullanıcı rolüne göre yönlendirme */}
        <Route path="/live-quiz/:sessionId" element={
          user?.role === 'teacher'
            ? <LiveQuizTeacherPage />
            : <LiveQuizStudentPage />
        } />
        <Route path="/my-quiz-history" element={<MyQuizHistoryPage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;