/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vritra: {
          dark: "#0a0a0c",
          card: "#141419",
          border: "#262633",
          gold: "#d4af37",
          "gold-hover": "#f39c12",
          crimson: "#8b0000",
          "crimson-light": "#b22222",
          slate: "#1f1f28",
          text: "#e0e0e0",
          muted: "#8a8a9e"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['"Cinzel"', 'serif'],
      }
    },
  },
  plugins: [],
}
