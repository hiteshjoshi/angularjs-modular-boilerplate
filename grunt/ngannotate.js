'use strict';

module.exports = function (path) {
  return {
    options: {
      singleQuotes: true,
    },
    dist: {
      files: [{
        expand: true,
        cwd: 'dist/bundles/',
        src: ['*.js', '!*.min.js'],
        dest: 'dist/bundles/'
      }]
    }
  };
};