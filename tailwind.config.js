/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Tailwind v4 uses CSS-based dark mode via @custom-variant in index.css
  // No need for darkMode config here
}
