webpackJsonp([7],{

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

/***/ 21:
/***/ function(module, exports) {

	'use strict';

	/**
	 * Activities feed controller
	 * @module: app.account
	 * @desc: Show some activity feed
	 */
	module.exports = function (module) {
	  module.controller('billingCtrl', ['$scope', 'api','$window','$interval', function ($scope, api,$window,$interval) {
	    $scope.plan = null;
	    $scope.profile = null;
	    $scope.billing_address = {
	      address_1 : '',
	      address_2 : '',
	      city : '',
	      state : '',
	      postal : '',
	      country_code : 'CA',
	    };
	  	api.get('users',$scope.user._id,'billing',false,function (err,response){
	  		if(err){

	  		}
	  		if(response.data.plan) {
	  			$scope.plan = response.data.plan;
	        $scope.profile = response.data.plan.user_id;
	        if($scope.profile.billing_details){
	          $scope.billing_address =  $scope.profile.billing_details;

	        }
	  		}

	  	});


	    $scope.showPopup = function showPopup(url){
	      var placement = 'top=' + (screen.height/2 - 250) + ',left=' + (screen.width/2 - 200) + ',width=400,height=500';
	      var interval = 1000;
	      var popup = $window.open(url, '', placement);

	      var i = $interval(function(){
	        interval += 500;
	        try {
	          // value is the user_id returned from paypal
	          if (popup.value){
	            $interval.cancel(i);
	            popup.close();
	          }
	        } catch(e){
	          console.error(e);
	        }
	      }, interval);

	    };
	    $scope.paypalUrl = null;

	  	$scope.addPaypal = function () {
	      $scope.msg = 'Please wait while we generate your secure paypal request';
	  		api.post('billing','paypal/subscribe',$scope.billing_address,function (err,response) {
	        //console.log(err,response);
	        $scope.msg = 'Done! Please click the button to subscribe';
	        $scope.paypalUrl = response.data;
	        //$scope.showPopup();
	  		});
	  	};


	  	$scope.removePaypal = function () {
	  		api.delete('billing','paypal/unsubscribe',function (err,response) {

	  		});
	  	};

	  	$scope.addCreditcard = function () {
	  		api.post('billing/'+$scope.plan._id,'creditcard',{},function (err,response) {

	  		});
	  	};

	  	$scope.removeCreditcard = function () {
	  		api.delete('billing',$scope.plan._id,'creditcard',function (err,response) {

	  		});
	  	};



	  }]);
	};


/***/ }

});