/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#0A0A0A',
          card: '#111111',
          'card-hover': '#1A1A1A',
        },
        gold: {
          DEFAULT: '#FFD600',
          dim: 'rgba(255, 214, 0, 0.15)',
          glow: 'rgba(255, 214, 0, 0.25)',
          light: '#FFE433',
        },
        accent: {
          green: '#3ecf8e',
          red: '#ff5555',
          blue: '#4da6ff',
          purple: '#a78bfa',
        },
        muted: '#868686',
        dim: '#4A4A4A',
      },
      borderColor: {
        gold: {
          DEFAULT: 'rgba(255, 214, 0, 0.2)',
          strong: 'rgba(255, 214, 0, 0.5)',
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
        'gold-glow': '0 0 30px rgba(255, 214, 0, 0.25)',
        'gold-glow-lg': '0 0 50px rgba(255, 214, 0, 0.35)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
