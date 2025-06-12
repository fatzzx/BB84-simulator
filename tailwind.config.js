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
          primary: '#6366f1',    // Indigo suave
          secondary: '#3b82f6',  // Azul médio (substituindo o roxo)
          accent: '#22d3ee',     // Ciano
          dark: '#1e293b',       // Slate escuro
          light: '#f8fafc',      // Slate claro
          success: '#34d399',    // Verde suave
          error: '#f87171',      // Vermelho suave
          surface: '#334155',    // Slate médio
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
        'quantum': '0 0 20px rgba(99, 102, 241, 0.2)',
        'quantum-lg': '0 0 30px rgba(99, 102, 241, 0.3)',
        'quantum-xl': '0 0 40px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  plugins: [],
} 