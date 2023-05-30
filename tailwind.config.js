/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  darkMode: 'class',
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: {
        default: '1rem',
        sm:'2rem',
        md:'3rem',
        lg:'4rem'
      }
    },
    extend: {
      colors: {
        primary: {
          default: '',
        }
      }
    },
  },
  plugins: [],
}
