// Öğrenci lobisi sayfası (quiz başlamasını bekler)
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import Card from '../components/Card';

function StudentLobbyPage() {
  // Parametre ve state'ler
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Quiz başlatılmayı bekliyor...');
  const emittedRef = useRef(false);

  // Lobiye katılım ve quiz başlatma dinleme
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const studentName = user?.username || 'Bilinmeyen Öğrenci';
    
    if (!emittedRef.current) {
      socket.emit('student-join-lobby', { sessionId, studentName });
      setStatus(`${studentName} olarak lobiye katıldınız. Quiz başlatılmayı bekliyor...`);
      emittedRef.current = true;
    }

    const handleQuizStart = () => {
        navigate(`/live-quiz/${sessionId}`);
    };

    socket.on('quiz-started', handleQuizStart);

    return () => {
      socket.off('quiz-started', handleQuizStart);
    };
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-500 via-pink-400 to-pink-600 p-4">
      <Card className="w-full max-w-lg mx-auto text-center animate-slide-in">
        <span className="text-xl font-semibold text-neutral-dark dark:text-white">{status}</span>
      </Card>
    </div>
  );
}

export default StudentLobbyPage;