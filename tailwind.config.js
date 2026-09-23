/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          emerald: '#0F5132',
          darkgreen: '#064E3B',
          forest: '#14532D',
          lightgreen: '#E8F5E9',
          surface: '#F0FDF4',
          accent: '#198754',
          saffron: '#D97706',
          gold: '#B45309',
          amberlight: '#FEF3C7',
          navy: '#0F172A',
          slate: '#334155',
          border: '#E2E8F0',
          card: '#FFFFFF',
          muted: '#64748B',
          error: '#DC2626',
          warning: '#EA580C',
          info: '#0284C7',
          success: '#16A34A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'gov-md': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'gov-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'gov-card': '0 2px 8px -2px rgba(15, 81, 50, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
