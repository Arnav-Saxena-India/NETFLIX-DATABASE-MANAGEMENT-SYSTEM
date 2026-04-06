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
        background: "#060e20",
        surface: "#0f1930",
        primary: "#8B5CF6",
        secondary: "#34b5fa",
        tertiary: "#F472B6",
      }
    },
  },
  plugins: [],
}
