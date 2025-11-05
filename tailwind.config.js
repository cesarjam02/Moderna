/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Un rojo más suave y moderno, como pediste
        'rojo-moderna': '#E53935', // Un rojo material design
        'rojo-moderna-dark': '#C62828', // Para el hover
      }
    },
  },
  plugins: [],
}