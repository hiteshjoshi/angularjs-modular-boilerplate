'use strict';

/**
 * Activities feed controller
 * @module: app.account
 * @desc: Show some activity feed
 */
module.exports = function (module) {
  module.controller('historyCtrl', ['$scope', 'api', function ($scope, api) {

  	api.get('users',$scope.user._id,'history',false,function (err,response){
  		if(err){

  		}
  		if(response.data.history && response.data.history.length>0) {
  			$scope.history = response.data.history;
  		}
  	});

  }]);
};