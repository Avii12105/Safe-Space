/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./layout/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981", // Emerald 500
        secondary: "#3b82f6", // Blue 500
        danger: "#ef4444", // Red 500
        warning: "#f59e0b", // Amber 500
        dark: "#1e293b", // Slate 800
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-short": "bounce 0.5s infinite",
        confetti: "confetti 1s ease-out forwards",
      },
      keyframes: {
        confetti: {
          "0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
          "100%": {
            transform: "translateY(100px) rotate(720deg)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
