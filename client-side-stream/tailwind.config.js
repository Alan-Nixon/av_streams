/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'medium-light-gray':'#363535'
      },      height: {
        'screen': '100vh',
      },

    },
  },
  plugins: [
  ],
} 