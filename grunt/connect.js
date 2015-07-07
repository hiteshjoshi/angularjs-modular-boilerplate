'use strict';

module.exports = function (path) {
  return {
    options: {
      port: 8000,
        hostname: 'localhost',
        livereload: true,
        base: ['src']
    },
    src: {
      options: {
        open: true
      }
    }
  };
};