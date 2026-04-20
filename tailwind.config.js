/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Anton', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#7300FF',
        'brand-secondary': '#00E4F0',
        'brand-accent': '#2E4BFF',
        'brand-cyan': '#00E4F0',
        'brand-blue': '#2E4BFF',
        'brand-green': '#0CDA4A',
        'brand-pink': '#FE1479',
        'brand-orange': '#FC9300',
        'brand-yellow': '#FFE012',
        'brand-background': '#FFFFFF',
        'brand-surface': '#F8F9FA',
        'brand-text-dark': '#000000',
        'brand-text-light': '#FFFFFF',
        'brand-warning': '#FC9300',
        'brand-danger': '#FE1479',
      },
    },
  },
  plugins: [],
}
