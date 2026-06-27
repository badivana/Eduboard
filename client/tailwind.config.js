/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // EduBoard brand green, carried over from the original site
        brand: {
          50: '#e9f9f2',
          100: '#c9f0de',
          200: '#94e2bd',
          300: '#5fd49c',
          400: '#2ec27e',
          500: '#04aa6d', // primary
          600: '#038a58',
          700: '#036b45',
          800: '#024d31',
          900: '#012e1d',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(0,0,0,0.15)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
