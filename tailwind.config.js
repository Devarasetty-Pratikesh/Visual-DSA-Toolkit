/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          deep: '#030712', // Slate 950
          card: '#0f172a', // Slate 900
          hover: '#1e293b', // Slate 800
        },
        brand: {
          primary: '#6366f1', // Indigo 500
          violet: '#8b5cf6', // Violet 500
          emerald: '#10b981', // Emerald 500
          rose: '#f43f5e', // Rose 500
          amber: '#f59e0b', // Amber 500
          sky: '#0ea5e9', // Sky 500
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-indigo': '0 0 15px rgba(99, 102, 241, 0.3)',
        'neon-emerald': '0 0 15px rgba(16, 185, 129, 0.3)',
        'neon-rose': '0 0 15px rgba(244, 63, 94, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
