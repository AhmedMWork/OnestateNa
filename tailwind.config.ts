import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-arabic)', 'Tahoma', 'Arial', 'sans-serif'],
      },
      colors: {
        obsidian: '#05070c',
        steel: '#aeb4bd',
        onestateGold: '#f3b41d',
        onestateGold2: '#ffd86f',
        onestateSilver: '#d8dce1',
        danger: '#ef4444',
        success: '#22c55e'
      },
      boxShadow: {
        gold: '0 0 40px rgba(243,180,29,.25)',
        panel: '0 20px 80px rgba(0,0,0,.45)'
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(circle at 50% 0%, rgba(243,180,29,.22), transparent 38%)',
        'grid-lines': 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
export default config;
