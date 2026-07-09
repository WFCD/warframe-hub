/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hub: {
          bg: 'var(--hub-bg)',
          primary: 'var(--hub-primary)',
          text: 'var(--hub-text)',
        },
      },
    },
  },
};
