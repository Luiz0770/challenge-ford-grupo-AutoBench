const plugin = require("tailwindcss/plugin");

// Cores definidas como variáveis CSS em global.css
const v = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

const category = (id) => ({ DEFAULT: v(`cat-${id}`), accent: v(`cat-${id}-accent`) });

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
        canvas: v("canvas"),
        paper: v("paper"),
        surface: v("surface"),
        subtle: v("subtle"),
        line: v("line"),
        navy: {
          950: v("navy-950"),
          900: v("navy-900"),
          800: v("navy-800"),
        },
        brand: {
          deep: v("brand-deep"),
          mid: v("brand-mid"),
          bright: v("brand-bright"),
          cyan: v("brand-cyan"),
          ink: v("brand-ink"),
          warm: v("brand-warm"),
        },
        blue: {
          600: v("blue-600"),
          500: v("blue-500"),
          400: v("blue-400"),
        },
        amber: {
          600: v("amber-600"),
          500: v("amber-500"),
          400: v("amber-400"),
          300: v("amber-300"),
          100: v("amber-100"),
        },
        ink: {
          900: v("ink-900"),
          700: v("ink-700"),
          400: v("ink-400"),
          300: v("ink-300"),
          200: v("ink-200"),
          100: v("ink-100"),
        },
        success: v("success"),
        warning: v("warning"),
        danger: v("danger"),
        info: v("info"),
        positive: {
          DEFAULT: v("positive"),
          soft: v("positive-soft"),
        },
        "warm-soft": v("warm-soft"),
        category: {
          suv: category("suv"),
          picape: category("picape"),
          sedan: category("sedan"),
          hatch: category("hatch"),
          crossover: category("crossover"),
          cupe: category("cupe"),
          esportivo: category("esportivo"),
          compacto: category("compacto"),
          eletrico: category("eletrico"),
          hibrido: category("hibrido"),
          conversivel: category("conversivel"),
          minivan: category("minivan"),
        },
      },
      // Geist carrega cada peso como uma família própria (app/_layout.tsx)
      fontFamily: {
        sans: ["Geist_400Regular", "system-ui", "sans-serif"],
        "sans-medium": ["Geist_500Medium"],
        "sans-semibold": ["Geist_600SemiBold"],
        "sans-bold": ["Geist_700Bold"],
        mono: ["GeistMono_400Regular", "ui-monospace", "monospace"],
        "mono-medium": ["GeistMono_500Medium"],
        "mono-semibold": ["GeistMono_600SemiBold"],
        "mono-bold": ["GeistMono_700Bold"],
      },
    },
  },
  // Atrasos gerados em passos de 20ms e mantidos no CSS mesmo quando a classe
  // é montada em runtime (ex.: riseClass(i * 50) em components/ui/motion.ts)
  safelist: [{ pattern: /^anim-delay-\d+$/ }],
  plugins: [
    // Atraso das animações de global.css: anim-delay-140, anim-delay-[280ms]
    plugin(({ matchUtilities }) => {
      const steps = Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i * 20), `${i * 20}ms`])
      );
      matchUtilities(
        { "anim-delay": (value) => ({ animationDelay: value }) },
        { values: steps }
      );
    }),
  ],
};
