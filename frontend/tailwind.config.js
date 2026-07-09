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
      },
    },
  },
  plugins: [],
};
