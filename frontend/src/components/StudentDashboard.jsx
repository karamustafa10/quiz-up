import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <p className="mb-8 text-neutral-dark dark:text-neutral text-center">
        Katılım kodu ile quizlere katıl, anlık puan tablosunda yerini gör ve eğlen!
      </p>
      <div className="flex flex-col gap-4 w-full mb-8">
        <Button color="warning" className="w-full" onClick={() => navigate('/join-quiz')}>Quiz'e Katıl</Button>
        <Button color="primary" className="w-full" onClick={() => navigate('/my-quiz-history')}>Geçmiş Quizlerim</Button>
      </div>
    </>
  );
}

export default StudentDashboard; 