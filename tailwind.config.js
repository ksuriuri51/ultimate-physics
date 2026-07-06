/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-cadet': '#2E3A52',
        'slate-gray': '#617891',
        'tan': '#D5B893',
        'coffee': '#6F4E37',
        'caput': '#3B2414',
      },
      fontFamily: {
        'mono': ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
