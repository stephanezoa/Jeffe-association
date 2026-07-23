/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EDFAF0',
          100: '#D6F3DD',
          200: '#AEE7BD',
          300: '#7FD69A',
          400: '#4FC275',
          500: '#2FA84F',
          600: '#238B41',
          700: '#1B6D33',
          800: '#155428',
          900: '#0F3D1D',
        },
        ink: {
          DEFAULT: '#141414',
          soft: '#1C1C1C',
          muted: '#6B7280',
          faint: '#9CA3AF',
        },
        accent: {
          blue: '#2563EB',
          blueDark: '#1B3B8B',
          blueSoft: '#EEF3FF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F4F4F5',
          mint: '#EFF9F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(2.25rem, 1.4rem + 3.4vw, 3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        heading: ['clamp(1.75rem, 1.2rem + 2.2vw, 2.5rem)', { lineHeight: '1.18', letterSpacing: '-0.015em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        pill: '0 8px 20px -8px rgba(20, 20, 20, 0.35)',
        card: '0 18px 40px -24px rgba(15, 23, 42, 0.35)',
        player: '0 30px 60px -30px rgba(15, 23, 42, 0.55)',
      },
      maxWidth: {
        content: '1180px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -2.5%, 0) scale(1.04)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        drift: 'drift 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
