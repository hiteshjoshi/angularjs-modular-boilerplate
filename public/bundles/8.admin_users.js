webpackJsonp([8],{

/***/ 22:
/***/ function(module, exports) {

	'use strict';

	/**
	 * Activities feed controller
	 * @module: app.account
	 * @desc: Show some activity feed
	 */
	module.exports = function (module) {
	  module.controller('adminCtrl', ['$scope', 'api','lodash','$modal', function ($scope, api,_,$modal) {

	  	$scope.alerts = [];
	  	$scope.users = [];
	  	$scope.newUser = {
	  		first_name : '',
	  		last_name : '',
	  		email : '',
	  		password : ''
	  	};


	  	$scope.addPlan = function(){
	  		var modalInstance = $modal.open({
	  			templateUrl: 'modules/dashboard/views/admin/new-plan-modal.html',
	  			controller: 'newPlanPopup'
		    });
	  	};

	    $scope.deactivatePlan = function (_id,index) {
	      api.put('admin','plans',_id,{},function (err,response) {
	        $scope.alerts.push({type:'info',msg:response.userMessage});
	        $scope.plans[index].active  = !$scope.plans[index].active;
	      });
	    };

	    $scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};

	  	//OPEN MODAL
	  	$scope.viewUser = function (_id) {
	  		var modalInstance = $modal.open({
	  			templateUrl: 'modules/dashboard/views/admin/modal.html',
	  			controller: 'viewUserPopup',
	  			resolve : {
	  				_id : function(){
	  					return _id;
	  				}
	  			}
		    });
		};


	  	$scope.addUser = function() {
	  		$scope.alerts = [];
	  		$scope.show_form = true;
	  		api.post('admin','users',$scope.newUser,function(err,response){
	  			if(err)
	  			{
		    		$scope.alerts.push({type:'danger',msg:'Server error.'});
		  		}
		  		else
		  		{
		  			if(response.error)
		  			{
		  				_.each(response.errors,function(elem,index){
		  					$scope.alerts.push({type:'danger',msg:elem.msg});
		  				});
		  			}
		  			else
		  			{
		  				$scope.alerts.push({type:'info',msg:'User added'});
		  				$scope.users.push(response.user);
		  			}
		  		}
	  		});
	  	};

	    $scope.getUsers = function () {
	      api.get('admin','users', false, {},function(err,response){
	      	if(err){
	      		$scope.alerts.push({type:'danger',msg:'Server error.'});
	    		}
	    		else{
	    			if(response.error)
	    			{
	    				console.log(response);
	    			}
	    			else
	    			{
	    				$scope.users = response.data.users;
	    			}
	    		}
	      });
	    };

	    $scope.getPlans = function () {
	      api.get('admin','plans', false, {},function(err,response){
	      	if(err){
	      		$scope.alerts.push({type:'danger',msg:'Server error.'});
	    		}
	    		else{
	    			if(response.error)
	    			{
	    				console.log(response);
	    			}
	    			else
	    			{
	    				$scope.plans = response.data.plans;
	    			}
	    		}
	      });
	    };





	  }]);

		module.controller('viewUserPopup', ['$scope','$modalInstance','api','_id',function ($scope, $modalInstance, api,user_id) {

			api.get('users',user_id,false,{},function(err,response){
				$scope.profile = response.data.profile;
			});
			$scope.ok = function () {
				$modalInstance.close($scope.selected.item);
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		}]);


		module.controller('newPlanPopup', ['$scope','$modalInstance','api',function ($scope, $modalInstance, api) {

	    $scope.activateButtonShow  = false;

	    var resetPlan = function () {
	      $scope.newPlan = {
	        name : '',
	        description: '',
	        emails : '',
	        text : '',
	        voice : '',
	        members :'',
	        price : '',
	        plan_type:1
	      };
	    };
	    resetPlan();


	    $scope.activatePlan = function () {
	      api.put('admin','plans',$scope.plan._id,{},function (err,response) {
	        if (err) {
	          $scope.msg = 'Server error';
	        }
	        else {
	          $scope.msg = response.userMessage || 'Plan actiavated';
	        }
	      });
	    };

	    var createPaypalPlan = function (plan) {
	      api.post('admin','plans/paypal',{
	        name : plan.name,
	        description: plan.description,
	        plan_id : plan._id
	      },function(err,response) {
	        if(err){
	          $scope.msg = 'Server error';
	        }
	        else {
	          if(response.error){
	            $scope.msg = response.userMessage;
	          }
	          else {
	            $scope.msg = 'Paypal subscription created.';
	            $scope.activateButtonShow = true;
	          }
	        }
	      });
	    };

	    $scope.addPlan = function () {
	      api.post('admin','plans',$scope.newPlan,function(err,response) {
	        if(err){
	          $scope.msg = 'Server error';
	        }
	        else {
	          if(response.error){
	            $scope.msg = response.userMessage;
	          }
	          else {
	            $scope.msg = 'Added plan, now trying to create paypal subscription for this';
	            $scope.plan = response.data.plan;
	            createPaypalPlan(response.data.plan);
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


/***/ }

});