/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#7c3aed', // mor
            light: '#a78bfa',
            dark: '#4c1d95',
          },
          accent: {
            DEFAULT: '#2563eb', // mavi
            light: '#60a5fa',
            dark: '#1e40af',
          },
          success: {
            DEFAULT: '#22c55e', // yeşil
            light: '#86efac',
            dark: '#166534',
          },
          warning: {
            DEFAULT: '#facc15', // sarı
            light: '#fde68a',
            dark: '#ca8a04',
          },
          danger: {
            DEFAULT: '#ef4444', // kırmızı
            light: '#fca5a5',
            dark: '#991b1b',
          },
          neutral: {
            DEFAULT: '#f3f4f6', // gri
            dark: '#374151',
          },
          base: {
            DEFAULT: '#fff',
            dark: '#18181b',
          },
        },
      },
    },
    plugins: [],
  }
  
  