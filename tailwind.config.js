/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#002F6C',
        accent: '#FFD93D'
      },
      boxShadow: {
        soft: '0 8px 28px rgba(2,22,47,.08)'
      },
      borderRadius: {
        '3xl': '1.6rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}