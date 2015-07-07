'use strict';

/**
 * Activities feed controller
 * @module: app.dashboard
 * @desc: Show some activity feed
 */
module.exports = function (module) {
  module.controller('homeCtrl', ['$scope','api',function ($scope,api) {
  	api.get('plans',false,false,{},function (err,response) {
  	  $scope.plans = response.data.plans;
  	});
  }]);
};
