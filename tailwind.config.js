/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        'connect-blue': '#3498db',
        'connect-red': '#e74c3c',
        'connect-yellow': '#f1c40f',
        'connect-board': '#2c3e50',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fall': 'fall 0.5s ease-in',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-400%)' },
          '100%': { transform: 'translateY(0)' }
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)' 
          }
        }
      },
      boxShadow: {
        'cell-inner': 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
