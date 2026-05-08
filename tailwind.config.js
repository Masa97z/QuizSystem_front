/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        karbalaei: ['Karbalaei', 'sans-serif'],
      },
      colors: {
        // Brand colors inspired by the provided logo image (Teal to Dark Blue gradient)
        brand: {
          50: '#f0f8fa',
          100: '#dbeef3',
          200: '#bcdce5',
          300: '#90c5d4',
          400: '#4bb4c7', // Logo top color
          500: '#3b9cb0', // Logo middle color
          600: '#308194',
          700: '#276686', // Logo bottom color
          800: '#22536b',
          900: '#1f4559',
          950: '#132c3b',
        },
        sun: '#ebc147', // Logo sun color
        paper: '#ebebeb', // Logo arch background color
      }
    },
  },
  plugins: [],
}
