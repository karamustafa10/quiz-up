import React from 'react';
export default function Loader({ size = 8 }) {
  return (
    <div className={`w-${size} h-${size} border-4 border-primary border-t-transparent rounded-full animate-spin`}></div>
  );
} 