// src/pages/TeacherLobbyPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

function TeacherLobbyPage() {
  // Parametre ve state'ler
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const emittedRef = useRef(false);
  const [copied, setCopied] = useState(false);

  // Lobiye giriş ve öğrenci dinleme
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const teacherName = user?.username || 'Bilinmeyen Öğretmen';

    // Sadece öğretmenler erişebilir
    if (!user || user.role !== 'teacher') {
      navigate('/dashboard');
      return;
    }

    if (!emittedRef.current) {
      socket.emit('teacher-join-lobby', sessionId, teacherName);
      emittedRef.current = true;
    }

    const handleStudentJoin = (studentName) => {
      setStudents((prev) => [...prev, studentName]);
    };

    socket.on('student-joined', handleStudentJoin);

    return () => {
      socket.off('student-joined', handleStudentJoin);
    };
  }, [sessionId, navigate]);

  // Quiz ve oturum bilgilerini çek
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/session/${sessionId}`);
        setQuizTitle(res.data.quiz?.title || 'Quiz');
        setJoinCode(res.data.joinCode);
      } catch (err) {
        console.error('Session bilgisi alınamadı:', err);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Quiz başlatma işlemi
  const currentQuiz = JSON.parse(localStorage.getItem('currentQuiz'));
  const handleStartQuiz = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'teacher') {
        alert('Sadece öğretmenler quiz başlatabilir.');
        navigate('/dashboard');
        return;
      }

      await axios.post(
        `http://localhost:5000/api/session/start`,
        { quizId: currentQuiz._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      socket.emit('start-quiz', sessionId);
      navigate(`/live-quiz/${sessionId}`);
    } catch (error) {
      console.error('Quiz başlatılamadı:', error);
      alert('Quiz başlatılırken hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 via-green-200 to-green-400 p-4">
      <Card className="w-full max-w-lg mx-auto animate-slide-in bg-gradient-to-br from-[#232526] to-[#414345] shadow-2xl rounded-3xl p-10 border-0 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">{quizTitle}</h1>
        {/* Katılım kodu ve kopyalama */}
        <div className="mb-4 flex flex-col items-center">
          <span className="text-base text-neutral-200 mb-1">Katılım Kodu:</span>
          <div className="flex items-center gap-2">
            <Badge color="accent">{joinCode}</Badge>
            <button
              className="ml-1 p-2 rounded-full bg-accent hover:bg-accent-dark text-white text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-lg"
              title="Kopyala"
              onClick={() => {
                navigator.clipboard.writeText(joinCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
            >
              <span role="img" aria-label="Kopyala">📋</span>
            </button>
          </div>
          {copied && (
            <span className="ml-2 text-green-400 text-sm animate-fade-in">Kopyalandı!</span>
          )}
        </div>
        {/* Katılan öğrenciler listesi */}
        <h2 className="text-lg font-semibold mb-2">Katılan Öğrenciler</h2>
        {students.length === 0 ? (
          <p className="text-neutral-200 dark:text-white text-base font-medium mb-4">Henüz katılan öğrenci yok.</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {students.map((name, index) => (
              <li key={index} className="bg-neutral/30 rounded-lg px-3 py-2 text-base text-white">{name}</li>
            ))}
          </ul>
        )}
        {/* Quiz başlat butonu */}
        <Button color="danger" className="w-full mt-2" onClick={handleStartQuiz}>
          Quiz'i Başlat
        </Button>
      </Card>
    </div>
  );
}

export default TeacherLobbyPage;