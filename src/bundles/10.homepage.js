webpackJsonp([10,12],{

/***/ 26:
/***/ function(module, exports) {

	'use strict';

	/**
	 * Activities feed controller
	 * @module: app.dashboard
	 * @desc: Show some activity feed
	 */
	module.exports = function (module) {
	  module.controller('signUpCtrl', ['$scope', '$modal', 'api', function ($scope, $modal, api) {

	    api.get('plans',false,false,{},function (err,response) {
	  	  $scope.plans = response.data.plans;
	  	});


	  	$scope.open = function (plan_id) {

	  		var modalInstance = $modal.open({
	  			templateUrl: 'modules/homepage/views/signup-modal.html',
	  			controller: 'signupModal',
	        resolve : {
	          plan_id: function(){

	            return plan_id;
	          }
	        }
		    });

		 };
	  }]);

	  module.controller('signupModal', ['$scope','$modalInstance','api','lodash','$cookieStore','plan_id',function ($scope, $modalInstance,api,_,$cookieStore,plan_id) {

		  $scope.showConfirm = false;
	    $scope.alerts = [];
	    $scope.newUser = {
	      email : '',
	      password:'',
	      plan_id:plan_id
	    };

	    $scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};

	    $scope.enterVerification = function () {
	      $scope.showConfirm = true;
	    };

		  $scope.signup = function(){

	      api.post('users',false,$scope.newUser,function(err,response){
	        if(err){

	        }
	        else {
	          if(response.error){
	            $scope.alerts=[];
	            _.each(response.errors,function(elem,index){
		  					$scope.alerts.push({type:'danger',msg:elem.msg});
		  				});
	          }
	          else {
	              $scope.alerts=[];
	              $scope.showConfirm = true;
	          }
	        }
	      });

		  };

		  $scope.confirm = function(validation_code){
	      api.post('users','confirm',{validation_code:validation_code},function(err,response){
	        if(err){

	        }
	        else {
	          if(response.error){
	            $scope.alerts=[];
	            _.each(response.errors,function(elem,index){
	              $scope.alerts.push({type:'danger',msg:elem.msg});
		  				});
	          }
	          else {
	            if(response.data.token){
	              $cookieStore.put('c2cCookie',response.data.token);
	              window.location.reload();
	            }
	          }
	        }
	      });
		  };


		  $scope.ok = function () {
		    $modalInstance.close($scope.selected.item);
		  };

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
		}]);
	};


/***/ },

/***/ 27:
/***/ function(module, exports) {

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


/***/ }

});