import React from 'react';

export default function ConfirmDialog({ open, title = 'Onay', message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70">
      <div className="bg-white dark:bg-base-dark rounded-xl shadow-lg p-6 min-w-[320px] relative text-neutral-dark dark:text-neutral flex flex-col items-center">
        <h3 className="text-lg font-bold mb-2 text-center">{title}</h3>
        <p className="mb-6 text-center">{message}</p>
        <div className="flex gap-4 w-full justify-center">
          <button
            className="px-4 py-2 rounded bg-danger text-white font-semibold hover:bg-danger-dark focus:outline-none"
            onClick={onConfirm}
          >
            Evet
          </button>
          <button
            className="px-4 py-2 rounded bg-neutral text-neutral-dark font-semibold hover:bg-neutral-dark/80 focus:outline-none"
            onClick={onCancel}
          >
            Hayır
          </button>
        </div>
      </div>
    </div>
  );
} 