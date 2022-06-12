const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  experimental: {
    variantGrouping: true,
  },
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
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
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
