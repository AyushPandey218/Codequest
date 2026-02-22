/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2b2bee',
        'background-light': '#f6f6f8',
        'background-dark': '#101022',
        'card-dark': '#1c1c27',
        'border-dark': '#282839',
        'text-secondary': '#9d9db9',
        'text-muted': '#9d9db9',
        'panel-dark': '#16162a',
        'surface-dark': '#1c1c27',
        'input-dark': '#1c1c27',
        'surface-border': '#282839',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
      },
    },
  },
  plugins: [],
}
