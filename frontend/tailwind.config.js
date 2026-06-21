/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nebula': {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d9ff',
          300: '#a4c0ff',
          400: '#7a9dff',
          500: '#5278ff',
          600: '#3a54f5',
          700: '#2c40e0',
          800: '#2636b5',
          900: '#25338f',
          950: '#1a2057',
        },
      },
    },
  },
  plugins: [],
}
