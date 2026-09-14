/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#467cdf',
          cream: '#FDFBF7',
          sand: '#F3E8D6',
          charcoal: '#2C2C2C',
          black: '#000000',
          white: '#FFFFFF',
          red: '#ff0000'
        }
      }
    },
  },
  plugins: [],
}