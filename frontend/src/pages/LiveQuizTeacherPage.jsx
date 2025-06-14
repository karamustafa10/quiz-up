// Canlı quiz yönetim ekranı (öğretmen için)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import axios from 'axios';
import Button from '../components/Button';
import Header from '../components/Header';
import Footer from '../components/Footer';

function LiveQuizTeacherPage() {
  // Parametre ve state'ler
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [answerStats, setAnswerStats] = useState(null);
  const [scoreboard, setScoreboard] = useState([]);
  const [showFinal, setShowFinal] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const [questionLocked, setQuestionLocked] = useState(false);

  // Quiz ve oturum bilgilerini çek
  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/session/${sessionId}`);
        setQuizTitle(res.data.quiz?.title || 'Quiz');
        setCreatorName(res.data.quiz?.createdBy?.username || 'Bilinmeyen');
      } catch (err) {}
    };
    fetchQuizInfo();
  }, [sessionId]);

  // Socket event'leri ile quiz akışını yönet
  useEffect(() => {
    const startCountdown = (sec, label) => {
      let counter = sec;
      setCountdown(`${label} ${counter}`);
      const interval = setInterval(() => {
        counter--;
        if (counter === 0) {
          clearInterval(interval);
          setCountdown(null);
        } else {
          setCountdown(`${label} ${counter}`);
        }
      }, 1000);
    };
    socket.on('quiz-countdown', (sec) => { if (!showFinal) startCountdown(sec, 'Quiz başlıyor...'); });
    socket.on('next-question-countdown', (sec) => { if (!showFinal) startCountdown(sec, 'Sonraki soru geliyor...'); });
    socket.on('show-question', ({ questionText, optionA, optionB, optionC, optionD, index, total, remainingTime, mediaType, mediaUrl }) => {
      if (showFinal) return;
      setQuestionData({ questionText, optionA, optionB, optionC, optionD, index, total, mediaType, mediaUrl });
      setCorrectOption(null);
      setAnswerStats(null);
      setShowScoreboard(false);
      setQuestionTimeLeft(remainingTime || 20);
    });
    socket.on('show-answer', ({ correctOption, answerStats }) => {
      if (showFinal) return;
      setCorrectOption(correctOption);
      setAnswerStats(answerStats);
      setShowScoreboard(false);
    });
    socket.on('show-scoreboard', ({ scores, answerStats }) => {
      if (showFinal) return;
      setScoreboard(scores);
      setAnswerStats(answerStats);
      setShowScoreboard(true);
    });
    socket.on('quiz-finished', ({ scores, quizTitle, quizCreator }) => {
      setShowFinal(true);
      setScoreboard(scores);
      setQuizTitle(quizTitle);
      setCreatorName(quizCreator);
      setShowScoreboard(false);
    });
    return () => {
      socket.off();
    };
  }, [sessionId, scoreboard, showFinal]);

  // Soru için sayaç ve kilitleme
  useEffect(() => {
    let timerInterval;
    if (questionData && !correctOption) {
      setQuestionLocked(false);
      timerInterval = setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setQuestionLocked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setQuestionTimeLeft(0);
      setQuestionLocked(false);
    }
    return () => clearInterval(timerInterval);
  }, [questionData, correctOption]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-primary/10 via-base/60 to-primary-dark/20 dark:from-base-dark dark:via-base-dark/80 dark:to-primary/20 transition-colors duration-700">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        {/* Quiz tamamlandıysa final ekranı */}
        {showFinal ? (
          <div className="w-full max-w-2xl bg-base dark:bg-base-dark rounded-2xl shadow-lg p-8 flex flex-col items-center border border-success/40 dark:border-success/60 animate-fade-in">
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl animate-bounce">🎉</span>
                <span className="text-2xl font-extrabold text-success">Quiz tamamlandı!</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📘</span>
                <span className="font-bold text-primary dark:text-primary-light">Quiz Başlığı:</span>
                <span className="font-semibold text-accent ml-1">{quizTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✍️</span>
                <span className="font-bold text-primary dark:text-primary-light">Hazırlayan:</span>
                <span className="font-semibold text-neutral-dark dark:text-neutral ml-1">{creatorName}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 mb-1">
                <span className="text-xl">🏆</span>
                <span className="font-bold text-accent text-lg">Final Puan Tablosu (Top 5)</span>
              </div>
              {/* Final puan tablosu */}
              <div className="w-full flex flex-col gap-2 mb-2">
                {Array.isArray(scoreboard) && scoreboard.sort((a, b) => b.score - a.score).slice(0, 5).map((entry, i) => {
                  const cup = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
                  return (
                    <div key={i} className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg border border-neutral/20 dark:border-neutral-dark/30 bg-neutral/10 dark:bg-base-dark/40 text-neutral-dark dark:text-neutral`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 text-xl">{cup || (i+1)}</span>
                        <span className="truncate">{i+1}. {entry.name}</span>
                      </div>
                      <span className="font-extrabold text-lg text-right min-w-[70px]">{entry.score} puan</span>
                    </div>
                  );
                })}
              </div>
              <Button color="primary" className="mt-6 w-full max-w-xs mx-auto" onClick={() => navigate('/dashboard')}>Ana Sayfaya Dön</Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-base dark:bg-base-dark rounded-2xl shadow-lg p-10 flex flex-col items-center border border-neutral dark:border-neutral-dark">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-primary dark:text-primary-light text-center"><span role="img" aria-label="beyin">🧠</span> Öğretmen Quiz Ekranı</h1>
            {/* Soru ve sayaç */}
            {questionData && !correctOption && (
              <div className="mb-4 w-full flex flex-row items-center justify-between">
                <span className="text-lg font-semibold text-primary dark:text-primary-light">Kalan Süre:</span>
                <span className={`text-lg font-bold px-4 py-1 rounded-lg ml-2 bg-primary dark:bg-primary-dark text-white transition-colors duration-300`}>
                  {questionTimeLeft} sn
                </span>
              </div>
            )}
            {/* Geri sayım */}
            {countdown && <h2 className="text-xl font-semibold mb-4 text-primary dark:text-primary-light animate-pulse">{countdown}</h2>}
            {/* Soru ve seçenekler */}
            {questionData && (
              <>
                <h2 className="text-lg font-bold mb-2 text-primary dark:text-primary-light text-center">Soru {questionData.index}/{questionData.total}</h2>
                {questionData?.mediaType === 'image' && questionData?.mediaUrl && (
                  <img
                    src={questionData.mediaUrl}
                    alt="Soruya ait görsel"
                    style={{ maxWidth: '100%', maxHeight: '300px', margin: '20px 0', borderRadius: '8px' }}
                  />
                )}
                {questionData?.mediaType === 'video' && questionData?.mediaUrl && (
                  <video
                    src={questionData.mediaUrl}
                    controls
                    style={{ maxWidth: '100%', maxHeight: '300px', margin: '20px 0', borderRadius: '8px' }}
                  />
                )}
                <h3 className="text-base mb-4 text-neutral-dark dark:text-neutral text-center">{questionData.questionText}</h3>
                <ul className="list-none p-0 w-full flex flex-col gap-2 mb-4">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    let style = `py-2 px-4 rounded-xl shadow-sm text-base cursor-default bg-neutral text-neutral-dark dark:bg-neutral-dark dark:text-white`;
                    if (correctOption) {
                      if (opt === correctOption) style = `py-2 px-4 rounded-xl shadow-sm text-base bg-success/80 text-white dark:bg-success-dark dark:text-white`;
                    }
                    if (questionLocked) style += ' opacity-60 pointer-events-none';
                    return (
                      <li key={opt} className={style}>
                        <span className="font-semibold mr-2">{opt})</span> {questionData[`option${opt}`]}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            {/* Cevap dağılımı ve doğru cevap */}
            {answerStats && !showScoreboard && !showFinal && (
              <div className="w-full mb-4 flex flex-col gap-4">
                {/* Doğru Cevap Kutusu */}
                <div className="flex items-center gap-2 bg-success/10 dark:bg-success-dark/20 border border-success/40 dark:border-success-dark/40 rounded-xl px-4 py-2">
                  <span className="text-success text-2xl">✔️</span>
                  <span className="font-bold text-success text-lg">Doğru Cevap:</span>
                  <span className="font-bold text-success-dark dark:text-success text-lg ml-1">{correctOption}</span>
                </div>
                {/* Cevap Dağılımı */}
                <div className="w-full bg-base/80 dark:bg-base-dark/80 rounded-xl p-4 border border-primary/20 dark:border-primary/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">📊</span>
                    <span className="font-bold text-primary dark:text-primary-light text-lg">Cevap Dağılımı:</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {Object.entries(answerStats || {}).map(([opt, pct]) => (
                      <div key={opt} className="flex items-center gap-3">
                        <span className="w-8 font-semibold text-neutral-dark dark:text-neutral">{opt})</span>
                        <div className="flex-1 h-4 bg-neutral/40 dark:bg-neutral-dark/40 rounded-full overflow-hidden">
                          <div
                            className={`h-4 rounded-full transition-all duration-500 ${pct > 0 ? 'bg-primary dark:bg-primary-light' : 'bg-neutral/60 dark:bg-base-dark/60'}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-right font-semibold text-neutral-dark dark:text-neutral">%{pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Puan tablosu */}
            {showScoreboard && !showFinal && (
              <div className="w-full mb-4 bg-base/80 dark:bg-base-dark/80 rounded-xl p-4 border border-accent/30 dark:border-accent/40 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏆</span>
                  <span className="font-bold text-accent text-lg">Puan Tablosu</span>
                </div>
                <ol className="list-none flex flex-col gap-2">
                  {scoreboard.sort((a, b) => b.score - a.score).map((entry, i) => {
                    const cup = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
                    return (
                      <li key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-dark dark:text-neutral`}>
                        <span className="w-6 text-xl">{cup || (i+1)}</span>
                        <span className="flex-1 truncate">{i+1}. {entry.name}</span>
                        <span className="font-semibold">{entry.score} puan</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default LiveQuizTeacherPage;
