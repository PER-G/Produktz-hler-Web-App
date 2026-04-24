/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: {
          base: '#0a0e1a',
          panel: '#111827',
          card: '#0f172a',
        },
        accent: {
          DEFAULT: '#06b6d4',
          soft: '#22d3ee',
        },
        ok: '#10b981',
        nok: '#ef4444',
      },
      boxShadow: {
        glow: '0 0 24px rgba(6, 182, 212, 0.35)',
        'glow-ok': '0 0 30px rgba(16, 185, 129, 0.45)',
        'glow-nok': '0 0 30px rgba(239, 68, 68, 0.45)',
      },
      animation: {
        scanline: 'scanline 2s linear infinite',
        pulseGlow: 'pulseGlow 1.8s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(0%)', opacity: '0.9' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0.9' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(6,182,212,0.3)' },
          '50%': { boxShadow: '0 0 36px rgba(6,182,212,0.7)' },
        },
      },
    },
  },
  plugins: [],
}
