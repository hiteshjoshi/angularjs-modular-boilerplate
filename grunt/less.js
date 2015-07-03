'use strict';

module.exports = function (path) {
  return {
    app: {
      files: {
        'src/assets/styles/app.css': 'src/assets/styles/less/app.less'
      }
    },

    libs: {
      expand: true,
      src: 'src/components/**/*.less',
      ext: '.css'
    }
  };
};