/** @type {import('tailwindcss').Config} */
const { withTV } = require('tailwind-variants/transformer');
module.exports = withTV({
   content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './stories/**/*.{js,ts,jsx,tsx}', // Here!
   ],
   darkMode: 'media',
   theme: {
      extend: {
         backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic':
               'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
         },
         colors: {
            primary: 'rgb(var(--primary) / <alpha-value>)',
            'primary-foreground':
               'rgb(var(--primary-foreground) / <alpha-value>)',
            secondary: 'rgb(var(--secondary) / <alpha-value>)',
            'secondary-foreground':
               'rgb(var(--secondary-foreground) / <alpha-value>)',
            accent: 'rgb(var(--accent) / <alpha-value>)',
            'accent-foreground':
               'rgb(var(--accent-foreground) / <alpha-value>)',
            bg: 'rgb(var(--bg) / <alpha-value>)',
         },
      },
   },
   plugins: [],
});
