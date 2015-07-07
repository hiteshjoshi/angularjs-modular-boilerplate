'use strict';

module.exports = function (path) {
  return {
    dist: {
      files: [{
        expand: true,
        cwd: 'dist/bundles/',
        src: '*.js',
        dest: 'dist/bundles/'
      }]
    }
  };
};