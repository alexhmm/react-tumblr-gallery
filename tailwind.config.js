module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {
        app: 'var(--app-bg)',
        menu: 'var(--menu-bg)'
      },
      borderColor: {
        app: 'var(--app-color)'
      },
      boxShadow: {
        menu: '-5px 0px 10px 0px rgba(0, 0, 0, 0.05)'
      },
      colors: {
        'posts-tag': '#acacac',
        // 'primary': 'var(--app-color-hover)'
        'primary': '#ff0000'
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px'
      },
      textColor: {
        app: 'var(--app-color)',
        sub: 'var(--sub-color)'
      },
      transitionTimingFunction: {
        'in-fast-out-slow': 'cubic-bezier(0.76, 0, 0.24, 1)'
      }
    }
  },
  plugins: []
};
