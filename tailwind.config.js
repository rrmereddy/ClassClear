/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary_color: 'rgba(255, 255, 255, 0.8)',
        secondary_color: 'rgb(245, 158, 11)',
        tertiary_color: 'rgb(75 85 99)',
      },

      keyframes: {
        'border-spin':{
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        'border-spin': 'border-spin 5s linear infinite',
      },
    },
  },
  plugins: [],
}