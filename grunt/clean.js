'use strict';

module.exports = function (path) {
  return {
    dist: ['public'],
    bundles: ['src/bundles'],
    docs: [
      'docs/assets',
      'docs/bundles'
    ]
  };
};