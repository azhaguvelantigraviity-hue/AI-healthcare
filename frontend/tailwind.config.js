/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Teal main
          600: '#0d9488',
          700: '#0f766e',
        },
        secondary: {
          500: '#3b82f6', // Blue main
        }
      }
    },
  },
  plugins: [],
}
