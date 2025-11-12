module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          overlay: 'var(--surface-overlay)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
          highlight: 'var(--border-highlight)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          warning: 'var(--text-warning)',
          danger: 'var(--text-danger)',
          inverse: 'var(--text-inverse)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          success: 'var(--accent-success)',
          warning: 'var(--accent-warning)',
          info: 'var(--accent-info)',
        },
        status: {
          positive: 'var(--status-positive)',
          negative: 'var(--status-negative)',
          warning: 'var(--status-warning)',
          info: 'var(--status-info)',
          neutral: 'var(--status-neutral)',
        },
      },
      fontFamily: {
        sans: ['var(--font-family-base)', 'sans-serif'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
      borderRadius: {
        md: 'var(--radius-md)',
      },
    },
  },
  plugins: [],
};
