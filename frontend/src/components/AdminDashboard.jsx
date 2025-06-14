import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

// Admin için ana panel fonksiyonu
function AdminDashboard() {
  // Sayfa yönlendirme fonksiyonu
  const navigate = useNavigate();
  return (
    <>
      {/* Açıklama metni */}
      <p className="mb-8 text-neutral-dark dark:text-neutral text-center">
        Sistem yönetimi ve istatistikler için admin paneline erişim sağla!
      </p>
      {/* Admin paneline yönlendiren buton */}
      <div className="flex flex-col gap-4 w-full mb-8">
        <Button color="primary" className="w-full" onClick={() => navigate('/admin')}>Admin Paneli</Button>
      </div>
      {/* Buraya admin'e özel butonlar veya içerikler eklenebilir */}
    </>
  );
}

export default AdminDashboard; 