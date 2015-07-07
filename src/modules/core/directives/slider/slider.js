'use strict';

/**
 * Page Loading indicator
 * @module: app.core
 * @desc: Application page loading indicator
 */
module.exports = function (module) {
  module.directive('layerSlider', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function($scope, iElm, iAttrs) {
        $timeout(function () {
          // jQuery(document).foundation(function(){});
          
          jQuery(iElm).layerSlider({
            skin: 'v5',
              skinsPath: '../assets/skins/'
          });
        });
      }
    };
  }]);
};