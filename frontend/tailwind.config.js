/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        'primary':'#F7F1DD',
        'switch':'#033700',
        'error':'#FF0000',
        'background':'#F7F1DD',
        'text':'#212B27'
      },
    },
  },
  plugins: [],
}

