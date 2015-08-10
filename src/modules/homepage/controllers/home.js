'use strict';

/**
 * Activities feed controller
 * @module: app.dashboard
 * @desc: Show some activity feed
 */
module.exports = function (module) {
  module.controller('homeCtrl', ['$scope','api','$modal',function ($scope,api,$modal) {
  	api.get('plans',false,false,{},function (err,response) {
  	  $scope.plans = response.data.plans;

	    $scope.quickDemo = function (index) {
	      	$modal.open({
	  			templateUrl: 'modules/homepage/views/quickDemo-popup.html'
		    });
	    };
	    $scope.quickDemo();
  	});
  }]);
};
