/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Core Brand ──────────────────────────────────
        primary:    '#059669',  // Emerald Green  — approved, success, brand
        'primary-dark': '#047857',
        'primary-light': '#D1FAE5',

        // ── Semantic ─────────────────────────────────────
        warning:    '#D97706',  // Heritage Amber — pending, review
        'warning-light': '#FEF3C7',
        danger:     '#E11D48',  // Rose Red       — rejected, critical
        'danger-light': '#FFE4E6',
        info:       '#2563EB',  // Official Blue  — informational

        // ── Neutrals / Layout ────────────────────────────
        sidebar:    '#0F172A',  // Deep Navy      — sidebar bg
        background: '#F8FAFC',  // Ghost Slate    — page bg
        surface:    '#FFFFFF',  // Card surface
        borders:    '#E2E8F0',  // Dividers
        textMain:   '#0F172A',  // Primary text
        textSub:    '#64748B',  // Subtext / labels
        textMuted:  '#94A3B8',  // Placeholders

        // ── Legacy aliases (keeps existing components working) ───
        accent:     '#EF4444',
        cards:      '#FFFFFF',
      },

      fontFamily: {
        sans:     ['Inter', 'system-ui', 'sans-serif'],
        heading:  ['"Plus Jakarta Sans"', 'Montserrat', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      boxShadow: {
        'card':  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-md': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
        'nav':   '0 1px 0 0 rgb(255 255 255 / 0.06)',
      },

      transitionDuration: {
        DEFAULT: '200ms',
      },

      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.3s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
}
