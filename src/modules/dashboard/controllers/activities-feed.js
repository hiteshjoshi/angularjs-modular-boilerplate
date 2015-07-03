'use strict';

/**
 * Activities feed controller
 * @module: app.dashboard
 * @desc: Show some activity feed
 */
module.exports = function (module) {
  module.controller('activitiesFeedCtrl', ['$scope', 'api', function ($scope, api) {
   	
   	api.get('users',123,function(err,response){
   		console.log(err,response);
   	});

  }]);
};