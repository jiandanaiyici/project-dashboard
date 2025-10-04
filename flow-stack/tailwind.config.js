/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
        success: '#52C41A',
        warning: '#FAAD14',
        danger: '#F5222D',
        '效能': '#0FC6C2',
        '协作': '#722ED1',
        '创新': '#FF7D00',
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}