/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        'secondary': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        },
        'file-header': '#2D2D2D',
        'file-border': '#3D3D3D',
      },
      spacing: {
        'file-card': '2rem',
        'form': '2rem',
      },
      boxShadow: {
        'card': '0 0 20px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 