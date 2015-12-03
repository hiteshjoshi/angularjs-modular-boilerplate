'use strict';

module.exports = function (path) {
  return {
  	app: {
      files: [{
        expand: true,
        cwd: 'src/modules',
        src  : '**/*.jsx',
        dest : 'src/modules',
      }]
    }
  };
};