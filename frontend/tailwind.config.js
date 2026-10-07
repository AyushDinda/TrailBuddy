/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f4f7f4',
          100: '#e5ece4',
          200: '#cbdac9',
          300: '#a5c0a3',
          400: '#79a177',
          500: '#568453',
          600: '#41693f',
          700: '#355333',
          800: '#2c432b',
          900: '#1d2c1c',
          950: '#0e170e',
        },
        moss: {
          DEFAULT: '#3B5E38',
          dark: '#263D24',
          light: '#EAF1E8',
        },
        earth: {
          50: '#faf7f2',
          100: '#f3ece2',
          200: '#e5d7c4',
          300: '#d2bda0',
          400: '#bca07e',
          500: '#aa8663',
          600: '#967154',
          700: '#7a5a44',
          800: '#644a3a',
          900: '#4a372c',
        },
        skycalm: {
          50: '#f0f7fa',
          100: '#d9ecf3',
          200: '#b6dce8',
          500: '#4a94b5',
          700: '#2d637c',
        },
        canvas: '#FAFBF8',
        surface: '#FFFFFF',
        sand: '#F3EFE6',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 46, 26, 0.06), 0 2px 6px -1px rgba(27, 46, 26, 0.04)',
        'lifted': '0 12px 32px -4px rgba(27, 46, 26, 0.10), 0 4px 12px -2px rgba(27, 46, 26, 0.05)',
        'card': '0 1px 3px 0 rgba(27, 46, 26, 0.06), 0 1px 2px 0 rgba(27, 46, 26, 0.04)',
      }
    },
  },
  plugins: [],
}
