/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Configurações de fonte melhoradas para legibilidade
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.4" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.5" }], // 14px
        base: ["1rem", { lineHeight: "1.5" }], // 16px (padrão)
        lg: ["1.125rem", { lineHeight: "1.6" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.6" }], // 20px
        "2xl": ["1.375rem", { lineHeight: "1.5" }], // 22px
        "3xl": ["1.5rem", { lineHeight: "1.4" }], // 24px
        "4xl": ["1.875rem", { lineHeight: "1.3" }], // 30px
      },
      colors: {
        quantum: {
          primary: "#6366f1", // Indigo suave (Alice)
          secondary: "#3b82f6", // Azul similar (Bob) - igual novamente
          accent: "#22d3ee", // Ciano
          dark: "#1e293b", // Slate escuro
          light: "#f8fafc", // Slate claro
          success: "#34d399", // Verde suave
          error: "#f87171", // Vermelho suave
          surface: "#334155", // Slate médio
        },
      },
      animation: {
        "quantum-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "quantum-spin": "spin 3s linear infinite",
        "quantum-float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        quantum: "0 0 20px rgba(99, 102, 241, 0.2)",
        "quantum-lg": "0 0 30px rgba(99, 102, 241, 0.3)",
        "quantum-xl": "0 0 40px rgba(99, 102, 241, 0.4)",
      },
    },
  },
  plugins: [],
};
