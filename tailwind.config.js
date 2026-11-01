/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      // Paleta: blanco roto (crema), verde salvia, dorado suave y tonos tierra.
      // Cambia estos valores para retocar toda la web de golpe.
      colors: {
        crema: {
          50: '#FDFBF7',
          100: '#FAF7F2', // blanco roto principal
          200: '#F3EEE5',
          300: '#E9E1D3',
        },
        salvia: {
          50: '#F4F7F2',
          100: '#E6EDE2',
          200: '#CDDAC6',
          300: '#AFC4A5',
          400: '#8FAA83',
          500: '#738F67',
          600: '#5C7552',
          700: '#485D41',
          800: '#3A4B35',
          900: '#2D3A2A',
        },
        oro: {
          50: '#FBF7EE',
          100: '#F5EBD3',
          200: '#EBD7A8',
          300: '#DEC17E',
          400: '#CFAA5E', // dorado suave
          500: '#B8924A',
          600: '#957439',
          700: '#755A2E',
        },
        tierra: {
          50: '#F8F4F0',
          100: '#EFE7DF',
          200: '#DDCFC2',
          300: '#C4B09F',
          400: '#A68E79',
          500: '#8B6F5A',
          600: '#735A48',
          700: '#5E4A3C',
          800: '#46372D',
          900: '#2E231D',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px -20px rgba(72, 93, 65, 0.35)',
        gold: '0 12px 30px -12px rgba(184, 146, 74, 0.55)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.14)', opacity: '0.85' },
        },
        'scroll-cue': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
        'pulse-soft': 'pulse-soft 2.2s ease-in-out infinite',
        'scroll-cue': 'scroll-cue 2s ease-in-out infinite',
        pop: 'pop 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
