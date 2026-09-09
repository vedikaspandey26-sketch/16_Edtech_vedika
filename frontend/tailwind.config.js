/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#0A0E1A',      // page background
        surface: '#131829',     // card / panel background
        surface2: '#1B2138',    // elevated / hover surface
        stroke: 'rgba(255,255,255,0.08)',
        strokeStrong: 'rgba(255,255,255,0.16)',
        text: {
          primary: '#F3F5FB',
          secondary: '#A7AFC7',
          tertiary: '#6E7690',
        },
        indigo: {
          soft: '#7C86FF',
          deep: '#4F46E5',
        },
        teal: {
          soft: '#5EEAD4',
          deep: '#14B8A6',
        },
        amber: {
          soft: '#FBBF77',
        },
        coral: '#FF8A80',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '20px',
        card: '24px',
        pill: '999px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,134,255,0.25), 0 8px 30px -8px rgba(124,134,255,0.45)',
        glowTeal: '0 0 0 1px rgba(94,234,212,0.25), 0 8px 30px -8px rgba(94,234,212,0.35)',
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.6)',
        cardHover: '0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 44px -16px rgba(0,0,0,0.7)',
      },
      transitionDuration: {
        250: '250ms',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-16px,0)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 9s ease-in-out infinite',
        fadeUp: 'fadeUp 400ms ease-out both',
      },
    },
  },
  plugins: [],
}
