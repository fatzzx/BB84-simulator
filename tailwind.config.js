/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quantum: {
          blue: '#00d4ff',    // Estados computacionais
          purple: '#9d4edd',  // Base Hadamard
          green: '#00ff88',   // Estados de superposição
        },
      },
      animation: {
        'quantum-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'quantum-spin': 'spin 3s linear infinite',
        'quantum-float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'quantum': '0 0 20px rgba(0, 212, 255, 0.3)',
        'quantum-lg': '0 0 30px rgba(0, 212, 255, 0.4)',
        'quantum-xl': '0 0 40px rgba(0, 212, 255, 0.5)',
      },
    },
  },
  plugins: [],
} 