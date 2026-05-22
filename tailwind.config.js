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
        canvas: "#F8F9FA",
        surface: "#FFFFFF",
        navy: {
          950: "#050E26",
          900: "#001C46",
          800: "#003478",
        },
        blue: {
          500: "#2589E6",
          600: "#0066CC",
          400: "#60A5FA",
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        ink: {
          900: "#212529",
          700: "#6C757D",
          400: "#ADB5BD",
          200: "#EEF0F3",
          100: "#F1F3F5",
        },
      },
      fontFamily: {
        sans: ["Geist_400Regular", "system-ui", "sans-serif"],
        mono: ["GeistMono_400Regular", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
