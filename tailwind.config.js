/**
 * Tailwind v4 reads its design tokens from `@theme` in app/globals.css and scans sources with `@source`.
 * This file is loaded via `@config` there; it mirrors the content roots and the token names so tooling
 * (editor plugins, class sorters) that still looks for a tailwind.config.js finds one.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,css}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { bone: '#0a0e14', dim: '#3f4c5c', sky: '#9db7d5', neon: '#e4ff1a' },
      fontFamily: {
        display: ['"Hanken Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Hanken Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Times New Roman"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'ui-monospace', '"SFMono-Regular"', 'monospace'],
      },
    },
  },
  plugins: [],
}
