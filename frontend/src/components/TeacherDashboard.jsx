// Öğretmen paneli bileşeni
import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

// Öğretmen için ana panel fonksiyonu
function TeacherDashboard() {
  // Sayfa yönlendirme fonksiyonu
  const navigate = useNavigate();
  return (
    <>
      {/* Açıklama metni */}
      <p className="mb-8 text-neutral-dark dark:text-neutral text-center">
        Quiz oluştur, öğrencilerini davet et ve canlı yarışmalar başlat!
      </p>
      {/* Ana aksiyon butonları */}
      <div className="flex flex-col gap-4 w-full mb-8">
        <Button color="primary" className="w-full" onClick={() => navigate('/create-quiz')}>Yeni Quiz Oluştur</Button>
        <Button color="accent" className="w-full" onClick={() => navigate('/select-quiz')}>Quiz Başlat</Button>
        <Button color="warning" className="w-full" onClick={() => navigate('/join-quiz')}>Quiz'e Katıl</Button>
      </div>
    </>
  );
}

export default TeacherDashboard; 