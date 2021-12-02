module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        app: 'var(--app-bg)',
        icon: 'var(--select-color)',
        menu: 'var(--menu-bg)'
      },
      borderColor: {
        app: 'var(--app-color)'
      },
      boxShadow: {
        menu: '-5px 0px 10px 0px rgba(0, 0, 0, 0.05)'
      },
      colors: {
        'like': '#e24855',
        'loader': 'var(--loader-color)',
        'posts-tag': '#acacac',
        'primary': '#0077fa'
      },
      placeholderColor: {
        sub: 'var(--sub-color)'
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px'
      },
      textColor: {
        app: 'var(--app-color)',
        hover: 'var(--app-color-hover)',
        sub: 'var(--sub-color)'
      },
      transitionTimingFunction: {
        'in-fast-out-slow': 'cubic-bezier(0.76, 0, 0.24, 1)'
      }
    }
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
};
