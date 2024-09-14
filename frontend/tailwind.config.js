/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Sesuaikan dengan format file yang Anda gunakan
  ],
  theme: {
    extend: {
      width: {
        '30%': '30%',
        '45%': '45%',
        '65%': '65%',
        '70%': '70%'
      }
    },
  },
  plugins: [],
}
