'use strict';

module.exports = function (path) {
  return {
    dist: {
      files: [{
        expand: true,
        cwd: 'dist/assets/styles/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/assets/styles/'
      }]
    }
  };
};