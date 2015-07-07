'use strict';

/**
 * Activities feed controller
 * @module: app.account
 * @desc: Show some activity feed
 */
module.exports = function (module) {
  module.controller('ecardsCtrl', ['$scope', 'api', function ($scope, api) {

  	$scope.sendEcards = function () {
  		api.post('users',$scope.user._id,'ecard',function (err,response){

  		});
  	};

  }]);
};