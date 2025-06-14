import React from 'react';
export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70">
      <div className="bg-white dark:bg-base-dark rounded-xl shadow-lg p-6 min-w-[300px] relative text-neutral-dark dark:text-neutral">
        <button className="absolute top-2 right-2 text-xl dark:text-neutral" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
} 