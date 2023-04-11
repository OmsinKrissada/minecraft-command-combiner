/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Inter, Noto Sans Thai',
        mc: 'Minecraftia',
        mono: 'Jetbrains Mono'
      }
    },
  },
  plugins: [],
}