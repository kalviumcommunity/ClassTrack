/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#38acf8',
          500: '#0e91e9',
          600: '#0273ca',
          700: '#035ca4',
          800: '#074e87',
          900: '#0c4270',
          950: '#082a4a',
        }
      }
    },
  },
  plugins: [],
}
