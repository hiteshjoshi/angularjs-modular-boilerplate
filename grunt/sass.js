'use strict';

module.exports = function (path) {
  return {
    dist: {
      files: {
        'src/assets/styles/app.css': 'src/assets/styles/sass/app.scss'
      }
    },

    libs: {
      expand: true,
      src: 'src/components/**/*.scss',
      ext: '.css'
    }
  };
};