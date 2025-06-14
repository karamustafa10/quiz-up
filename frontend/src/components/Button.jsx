import React from 'react';

// Renk seçenekleri
const COLORS = {
  primary: 'bg-primary text-white hover:bg-primary-dark hover:text-white dark:bg-primary-dark dark:text-white dark:hover:bg-primary',
  accent: 'bg-accent text-white hover:bg-accent-dark hover:text-white dark:bg-accent-dark dark:text-white dark:hover:bg-accent',
  success: 'bg-success text-white hover:bg-success-dark hover:text-white dark:bg-success-dark dark:text-white dark:hover:bg-success',
  warning: 'bg-warning text-neutral-dark hover:bg-warning-dark hover:text-white dark:bg-warning-dark dark:text-neutral dark:hover:bg-warning dark:hover:text-white',
  danger: 'bg-danger text-white hover:bg-danger-dark hover:text-white hover:shadow-lg hover:shadow-danger/40 dark:bg-danger-dark dark:text-white dark:hover:bg-danger dark:hover:text-white',
  neutral: 'bg-neutral text-neutral-dark hover:bg-neutral-dark hover:text-white dark:bg-base-dark dark:text-neutral dark:hover:bg-neutral dark:hover:text-black',
};

// Buton fonksiyonu
function Button({
  children,
  color = 'primary',
  className = '',
  size = 'lg',
  loading = false,
  disabled = false,
  ...props
}) {
  // Boyutlara göre class
  const sizeClasses = size === 'lg'
    ? 'py-3 px-8 text-lg'
    : size === 'md'
    ? 'py-2 px-6 text-base'
    : 'py-1.5 px-4 text-sm';

  return (
    // Buton kutusu
    <button
      className={`flex justify-center items-center rounded-2xl font-extrabold shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-light transition-all duration-200 ${COLORS[color] || COLORS.primary} ${sizeClasses} ${className} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Yükleniyor animasyonu */}
      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin align-middle mr-2"></span>
      ) : null}
      {children}
    </button>
  );
}

export default Button; 