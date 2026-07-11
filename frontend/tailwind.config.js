/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aerospace: {
          50: '#eef8ff',
          100: '#d9f0ff',
          200: '#bce3ff',
          300: '#8ed2ff',
          400: '#53b7ff',
          500: '#2a99ff',
          600: '#147bff',
          700: '#0e64f0',
          800: '#1251c2',
          900: '#154698',
          950: '#112b5c',
        },
        hud: {
          blue: '#00d4ff',
          cyan: '#00ffb9',
          green: '#00ff88',
          amber: '#ffb300',
          orange: '#ff6a00',
          red: '#ff0040',
        },
        surface: {
          900: '#0a0e17',
          800: '#0f1524',
          700: '#151d30',
          600: '#1a2540',
          500: '#233150',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan 2s linear infinite',
        'flow': 'flow 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'drift': 'drift 20s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite alternate',
        'breath': 'breath 4s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.6)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -15px)' },
          '50%': { transform: 'translate(-5px, -25px)' },
          '75%': { transform: 'translate(-15px, -10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderGlow: {
          '0%': { borderColor: 'rgba(0, 212, 255, 0.1)', boxShadow: '0 0 8px rgba(0, 212, 255, 0.02)' },
          '100%': { borderColor: 'rgba(0, 212, 255, 0.25)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.08)' },
        },
        breath: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
};
