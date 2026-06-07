import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors
        primary: {
          DEFAULT: '#1A4731', // Deep Forest Green for nav, buttons, headings
          dark: '#00301C',
        },
        secondary: {
          DEFAULT: '#2ECC71', // Emerald for active indicators and success states
        },
        background: '#F7FAF8', // Soft off-white global background
        surface: '#FFFFFF',    // Lifted cards and sidebar background
        charcoal: '#1C1C1E',   // Dark text color
        outline: '#717972',
        error: '#BA1A1A',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',  // 12px standard (cards, buttons, inputs, modals)
        lg: '12px',  // 12px standard (cards, buttons, inputs, modals)
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        // Shadow profile with primary color tint for warmth
        card: '0px 4px 20px rgba(26, 71, 49, 0.05)',
        'card-hover': '0px 8px 32px rgba(26, 71, 49, 0.10)',
      },
      spacing: {
        base: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px', // Section gap
      },
    },
  },
  plugins: [],
};
export default config;
