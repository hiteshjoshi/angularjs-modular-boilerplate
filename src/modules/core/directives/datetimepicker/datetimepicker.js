'use strict';

/**
 * Slimscroll
 * @module: app.core
 * @desc: Application custom scrollbar
 */
module.exports = function (module) {
  module.value('datetimepickerConfig', {});
  module.directive('datetimepicker', ['$timeout', 'datetimepickerConfig','moment', function ($timeout, datetimepickerConfig,moment) {

    Date.parseDate = function( input, format ){
      return moment(input,format).toDate();
    };
    Date.prototype.dateFormat = function( format ){
      return moment(this).format(format);
    };

    var options ={
      inline:true,
      minDate:0,
      startDate:new Date(),
      todayButton:true,
      format:'DD.MM.YYYY h:mm a',
      formatTime:'h:mm a',
      formatDate:'DD.MM.YYYY'
    };

    if (datetimepickerConfig) { angular.extend(options, datetimepickerConfig); }

    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
          ngModel: '=',
          baseDate: '=',
          dateTimepicker: '=',
      },
      link: function($scope, iElm, iAttrs,ngModel) {
        $timeout(function () {

          var opts = angular.extend({}, options);

          angular.element(iElm).datetimepicker(
            angular.extend(opts, ngModel.$modelValue?ngModel.$modelValue:{})
          );
        });
      }
    };
  }]);
};
