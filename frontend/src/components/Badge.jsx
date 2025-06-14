import React from 'react';
export default function Badge({ children, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary text-white dark:bg-primary-dark dark:text-white',
    success: 'bg-success text-white dark:bg-success-dark dark:text-white',
    warning: 'bg-warning text-neutral-dark dark:bg-warning-dark dark:text-neutral',
    danger: 'bg-danger text-white dark:bg-danger-dark dark:text-white',
    neutral: 'bg-neutral text-neutral-dark dark:bg-base-dark dark:text-neutral',
    accent: 'bg-accent text-white dark:bg-accent-dark dark:text-white',
  };
  return (
    <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${colorMap[color]}`}>{children}</span>
  );
} 