/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          lime: '#C8F135',
          cyan: '#00F5D4',
          orange: '#FF6B2B',
          violet: '#7B61FF',
          pink: '#FF3EA5',
        },
        dark: {
          900: '#0A0A0F',
          800: '#12121A',
          700: '#1A1A26',
          600: '#222232',
          500: '#2E2E45',
          400: '#3D3D5C',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
