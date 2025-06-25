/**
 * CreateQuizPage Component
 * 
 * This component provides a form for teachers to create new quizzes, featuring:
 * - Quiz title input
 * - Dynamic question management
 * - Multiple choice options (A, B, C, D)
 * - Correct answer selection
 * - Media attachment support (images/videos)
 * - Form validation and error handling
 * - Loading states during submission
 * - Responsive design with dark mode support
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../services/quizService';
import Button from '../components/Button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNotification } from '../contexts/NotificationContext';

function CreateQuizPage() {
  // Navigation and notification hooks
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Component state management
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { 
      question: '', 
      options: ['', '', '', ''], 
      correctAnswer: '', 
      mediaType: '', 
      mediaUrl: '', 
      mediaFile: null 
    }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle question text and options changes
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === 'question') {
      updated[index].question = value;
    } else {
      updated[index].options[field] = value;
    }
    setQuestions(updated);
  };

  // Handle correct answer selection
  const handleCorrectAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  // Handle media type selection
  const handleMediaTypeChange = (index, value) => {
    const updated = [...questions];
    updated[index].mediaType = value;
    updated[index].mediaUrl = '';
    updated[index].mediaFile = null;
    setQuestions(updated);
  };

  // Handle media file upload
  const handleMediaUpload = async (index, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/upload-media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      const updated = [...questions];
      updated[index].mediaUrl = data.url;
      setQuestions(updated);
    } catch (err) {
      console.error('Dosya yükleme hatası:', err);
      showNotification('Dosya yüklenemedi.', 'error');
    }
  };

  // Add a new question to the quiz
  const addNewQuestion = () => {
    setQuestions([...questions, { 
      question: '', 
      options: ['', '', '', ''], 
      correctAnswer: '', 
      mediaType: '', 
      mediaUrl: '', 
      mediaFile: null 
    }]);
  };

  // Handle quiz form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if user is a teacher
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'teacher') {
      setError('Sadece öğretmenler quiz oluşturabilir.');
      showNotification('Sadece öğretmenler quiz oluşturabilir.', 'error');
      setLoading(false);
      return;
    }

    // Transform questions for API submission
    const transformedQuestions = questions.map((q) => {
      const correctIndex = q.options.indexOf(q.options[["A", "B", "C", "D"].indexOf(q.correctAnswer)]);
      return {
        question: q.question,
        options: q.options,
        correctAnswer: ["A", "B", "C", "D"][correctIndex],
        mediaType: q.mediaType,
        mediaUrl: q.mediaUrl
      };
    });

    try {
      await createQuiz({ title: quizTitle, questions: transformedQuestions });
      showNotification('Quiz başarıyla oluşturuldu!', 'success');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError('Quiz oluşturulurken bir hata oluştu.');
      showNotification('Quiz oluşturulurken bir hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-primary/10 via-base/60 to-primary-dark/20 dark:from-base-dark dark:via-base-dark/80 dark:to-primary/20 transition-colors duration-700">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-2xl bg-base dark:bg-base-dark rounded-2xl shadow-lg p-10 flex flex-col items-center border border-neutral dark:border-neutral-dark">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-primary-dark dark:text-primary text-center">Yeni Quiz Oluştur</h1>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <input
              type="text"
              placeholder="Quiz Başlığı"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
              className="w-full py-3 px-4 rounded-2xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            {questions.map((q, index) => (
              <div key={index} className="bg-neutral dark:bg-base-dark rounded-xl p-6 mb-2 flex flex-col gap-4 border border-neutral-dark/10 dark:border-neutral-dark/30 shadow-sm">
                <input
                  type="text"
                  placeholder={`Soru ${index + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  required
                  className="w-full py-2 px-3 rounded-xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map((opt, optIndex) => (
                    <input
                      key={opt}
                      type="text"
                      placeholder={`${opt} seçeneği`}
                      value={q.options[optIndex]}
                      onChange={(e) => handleQuestionChange(index, optIndex, e.target.value)}
                      required
                      className="py-2 px-3 rounded-xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base"
                    />
                  ))}
                </div>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                  required
                  className="w-full py-2 px-3 rounded-xl border border-success/40 dark:border-success/60 bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-base"
                >
                  <option value="">Doğru Cevap Seç</option>
                  <option value="A">A - {q.options[0]}</option>
                  <option value="B">B - {q.options[1]}</option>
                  <option value="C">C - {q.options[2]}</option>
                  <option value="D">D - {q.options[3]}</option>
                </select>

                {/* 📸🎥 Medya Seçimi */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Medya Türü:</label>
                  <select
                    value={q.mediaType}
                    onChange={(e) => handleMediaTypeChange(index, e.target.value)}
                    className="py-2 px-3 rounded-xl border border-neutral dark:border-neutral-dark bg-base dark:bg-base-dark text-neutral-dark dark:text-neutral text-sm"
                  >
                    <option value="">Yok</option>
                    <option value="image">Görsel</option>
                    <option value="video">Video</option>
                  </select>

                  {q.mediaType && (
                    <>
                      <input
                        type="file"
                        accept={q.mediaType === 'image' ? 'image/*' : 'video/*'}
                        onChange={(e) => handleMediaUpload(index, e.target.files[0])}
                        className="text-sm"
                      />
                      {q.mediaUrl && (
                        q.mediaType === 'image' ? (
                          <img src={q.mediaUrl} alt="Görsel" className="rounded-xl mt-2 max-w-full" />
                        ) : (
                          <video src={q.mediaUrl} controls className="rounded-xl mt-2 max-w-full" />
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <Button color="warning" type="button" className="w-full" onClick={addNewQuestion}>
              + Yeni Soru Ekle
            </Button>
            <Button color="primary" type="submit" className="w-full" loading={loading} disabled={loading}>
              Quiz Oluştur
            </Button>
            {error && <p className="text-danger font-semibold text-center mt-2">{error}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CreateQuizPage;
