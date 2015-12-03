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
  }])

  .directive('myIframe', function(){
    var linkFn = function(scope, element, attrs) {
        element.find('iframe').bind('load', function (event) {
          event.target.contentWindow.scrollTo(0,400);
        });
    };
    return {
      restrict: 'EA',
      scope: {
        src:'@src',
        height: '@height',
        width: '@width',
        scrolling: '@scrolling'
      },
      template: '<iframe class="frame" height="{{height}}" frameborder="0" width="{{width}}" frameborder="0" border="0" marginwidth="0" marginheight="0" scrolling="{{scrolling}}" ng:src="{{src}}"></iframe>',
      link : linkFn
    };
  });
};
