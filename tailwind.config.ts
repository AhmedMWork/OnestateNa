import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        onestateGold: '#d8a632',
        onestateGoldSoft: '#ffd978',
        onestateSilver: '#d7dde7',
        onestateCarbon: '#08090d',
        onestatePanel: '#10131d'
      },
      boxShadow: {
        gold: '0 0 35px rgba(216, 166, 50, .28)',
        panel: '0 22px 60px rgba(0,0,0,.42)'
      },
      backgroundImage: {
        'metal-grid': 'linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)',
        'radial-gold': 'radial-gradient(circle at 20% 10%, rgba(216,166,50,.22), transparent 34%), radial-gradient(circle at 80% 0%, rgba(215,221,231,.16), transparent 28%), linear-gradient(145deg,#07080c,#111521 60%,#050508)'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.6s linear infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite'
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 25px rgba(216,166,50,.18)' }, '50%': { boxShadow: '0 0 55px rgba(216,166,50,.38)' } }
      }
    }
  },
  plugins: []
};
export default config;
