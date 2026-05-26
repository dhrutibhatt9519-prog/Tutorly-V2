/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        tutorly: {
          bg: "#f6f2ea",
          surface: "#fffdf9",
          text: "#29463f",
          heading: "#18342e",
          teal: "#127472",
          "teal-deep": "#0c6664",
          gold: "#dfb930"
        }
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"]
      }
    }
  },
  plugins: []
};
