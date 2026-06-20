/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18212f',
        coral: '#f26957',
        ocean: '#147b8f',
        mint: '#dff5ec',
        paper: '#faf8f4'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(24, 33, 47, 0.08)'
      }
    }
  },
  plugins: []
};
