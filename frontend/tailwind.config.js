/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maternal: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a3b18a', // calming sage green
          600: '#588157',
          700: '#3a5a40',
          800: '#344e41',
          900: '#202c24',
        },
        accent: {
          light: '#f4a261', // soft orange
          DEFAULT: '#e76f51', // terracotta
          dark: '#d15b3e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
