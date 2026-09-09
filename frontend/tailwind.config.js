/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213D',
        paper: '#FBFCFA',
        mist: '#EFF1EE',
        highlight: '#C6F135',
        highlightDeep: '#9FCB1B',
        flag: '#FF6B4A',
        pencil: '#6B7280',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
}
