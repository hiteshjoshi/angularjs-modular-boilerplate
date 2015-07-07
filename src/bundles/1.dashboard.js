webpackJsonp([1],{

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

/***/ 15:
/***/ function(module, exports) {

	'use strict';

	/**
	 * Activities feed controller
	 * @module: app.account
	 * @desc: Show some activity feed
	 */
	module.exports = function (module) {
	  module.controller('dashboardCtrl', ['$scope', 'api','$state', function ($scope, api,$state) {
	  	$scope.alerts = [];
	  	$scope.reminders = [];
	  	$scope.plan = null;
	  	api.get('ping',false,false,false,function (err,response){

	  		if(err){

	  		}
	  		if(response.data && response.data.plan.paid) {
	  			$scope.plan = response.data;
	  		}
	  		else{
	  			$scope.alerts.push({type:'info',msg:'Your billing is pending. Please visit billing page and fix this.'});
	        //$state.go('dashboard.billing');
	  		}
	  	});

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

	  	api.get('reminders',false,false,false,function (err,response){
	  		if(err){

	  		}
	  		if(response.data && response.data.length>0) {
	  			$scope.reminders = response.data;
	  		}
	  		else{
	  			$scope.alerts.push({type:'info',msg:'You do not have any reminders set. Please set reminders.'});
	  		}
	  	});

	  	$scope.addReminder = function () {
	  		api.post('reminders',false,false,function (err,response){

	  		});
	  	};

	  	$scope.updateReminder = function (index) {

	  		api.put('reminders',$scope.reminders[index]._id,false,{},function (err,response){

	  		});

	  	};

	  	$scope.deleteReminder = function (index) {
	  		api.delete('reminders',$scope.reminders[index]._id,false,function (err,response){

	  		});

	  	};


	  }]);
	};


/***/ }

});