module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'posts-tag': '#acacac',
        'primary': 'var(--theme-color-hover)',
        // primary: '#ff0000',
        'tag': 'var(--tag-color)'
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px'
      }
    }
  },
  plugins: []
};
