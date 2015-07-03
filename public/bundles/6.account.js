webpackJsonp([6],{

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

/***/ 20:
/***/ function(module, exports) {

	'use strict';

	/**
	 * Activities feed controller
	 * @module: app.account
	 * @desc: Show some activity feed
	 */
	module.exports = function (module) {
	  module.controller('accountCtrl', ['$scope', 'api', function ($scope, api) {

	  	api.get('users','ping',false,false,function (err,response){
	  		if(err){

	  		}
	  			$scope.plan = response.data.plan;
	        $scope.profile = response.data.plan.user_id;
	  	});

	  	$scope.updateAccount = function () {
	  		api.put('users',$scope.user._id,'account',{},function (err,response) {
	        
	  		});
	  	};


	  }]);
	};


/***/ }

});