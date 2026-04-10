import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        surface: '#1a1a1a',
        'surface-elevated': '#242424',
        border: '#2a2a2a',
        text: '#f5f5f5',
        'text-secondary': '#a0a0a0',
        'text-muted': '#666666',
        paid: '#22c55e',
        'paid-bg': 'rgba(34,197,94,0.15)',
        unpaid: '#f59e0b',
        'unpaid-bg': 'rgba(245,158,11,0.15)',
        overdue: '#ef4444',
        'overdue-bg': 'rgba(239,68,68,0.15)',
        accent: '#6366f1',
        'accent-bg': 'rgba(99,102,241,0.15)',
        'tab-bar': '#121212',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.4' }],
        sm: ['14px', { lineHeight: '1.5' }],
        md: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.5' }],
        xl: ['24px', { lineHeight: '1.3' }],
        xxl: ['32px', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
} satisfies Config
