const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@headlessui/react/dist/',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hind Madurai', ...defaultTheme.fontFamily.sans],
        serif: ['Titillium Web', ...defaultTheme.fontFamily.serif],
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
}
