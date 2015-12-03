webpackJsonp([4],{

/***/ 14:
/***/ function(module, exports) {

	'use strict';

	/**
	 * Activities feed controller
	 * @module: app.dashboard
	 * @desc: Show some activity feed
	 */
	module.exports = function (module) {
	  module.controller('commonCtrl', ['$rootScope', 'api', function ($rootScope, api) {
	    	
	    	// $rootScope.logout = function (argument) {
	    	// 	api.post('logout',false,false,function (err,response){
	    	// 		console.log(err,response);
	    	// 	});
	    	// }


	  }]);
	};

/***/ },

/***/ 18:
/***/ function(module, exports) {

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

/***/ }

});