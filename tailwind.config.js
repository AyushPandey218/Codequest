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
        background: "hsl(213 45% 67%)",
        foreground: "hsl(0 0% 100%)",
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
        instrument: ['Instrument Serif', 'serif'],
        heading: ["'Instrument Serif'", "serif"],
      },
      letterSpacing: {
        'tight-hero': '-0.04em', // roughly -4px on large text
      },
      fontSize: {
        'hero-title': ['84px', '1'],
      },
      borderRadius: {
        DEFAULT: '9999px',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
