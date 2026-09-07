/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        scitech: {
          navy: 'var(--bg-primary)',
          'navy-glare': 'var(--bg-primary-glare)',
          slate: 'var(--bg-secondary)',
          'slate-hover': 'var(--bg-secondary-hover)',
          mint: 'var(--accent-primary)',
          'mint-hover': 'var(--accent-primary-hover)',
          'mint-dim': 'var(--accent-primary-dim)',
          'border-light': 'var(--border-light)',
          cyan: 'var(--accent-cyan)',
          purple: 'var(--accent-purple)',
          error: 'var(--status-error)',
        },
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          dark: 'var(--text-dark)',
        }
      }
    }
  },
  plugins: []
};
