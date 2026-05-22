/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050810",
          900: "#0A0F1E",
          800: "#131929",
          700: "#1A2540",
          600: "#1E2D47",
          500: "#243352",
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        slate: {
          200: "#E2E8F0",
          400: "#94A3B8",
          500: "#64748B",
        },
      },
    },
  },
  plugins: [],
};
