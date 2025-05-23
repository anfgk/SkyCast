/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        secondary: "#2d2d2d",
        accent: "#3498db",
      },
      backgroundColor: {
        dark: "#121212",
        "dark-lighter": "#1e1e1e",
      },
    },
  },
  plugins: [],
};
