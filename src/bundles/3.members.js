webpackJsonp([3],{

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

/***/ 17:
/***/ function(module, exports) {

	'use strict';

	/**
	 * Activities feed controller
	 * @module: app.account
	 * @desc: Show some activity feed
	 */
	module.exports = function (module) {
	  module.controller('membersCtrl', ['$scope', 'api','lodash', function ($scope, api,_) {

	    $scope.show_form = false;
	    $scope.edit_form = false;
	    $scope.alerts = [];
	    $scope.newMember = {
	      first_name : '',
	      last_name : '',
	      email_address:'',
	      timezone : 'pacific',
	      preferred_number:'1',
	      mobile : '',
	      landline:''
	    };
	    $scope.closeAlert = function(index) {
	      $scope.alerts.splice(index, 1);
	    };

	  	api.get('users',$scope.user._id,'networks',false,function (err,response){
	  		if(err){

	  		}
	  		if(response.data.members && response.data.members.length>0) {
	  			$scope.members = response.data.members;
	  		}
	  	});



	  	$scope.addMember = function () {
	  		api.post('users',$scope.user._id+'/networks',$scope.newMember,function (err,response){
	        if(err){

	        }else {
	        
	          
	          if(response.error){
	            $scope.alerts = [];
	            _.forEach(response.errors,function(item){
	              $scope.alerts.push({type:'error',msg:item.msg});
	            });
	          }
	          else{
	            $scope.members = response.data.members;
	            $scope.show_form = false;
	            $scope.edit_form = false;
	          }
	            
	          
	        }
	  		});
	  	};


	    $scope.removeMember = function (index,_id) {
	  		api.delete('users',$scope.user._id,'networks/'+_id,function (err,response){
	        if(err){

	        }else {
	          if(response.error){

	          }else {
	            $scope.members.splice(index,1);
	            //$scope.members = response.data.members;
	          }
	        }
	  		});
	  	};


	    $scope.showEditForm = function (index) {
	      $scope.edit_form = true;
	      $scope.show_form = false;
	      $scope.editMember = $scope.members[index];
	  	};

	    $scope.updateMember = function () {
	      api.put('users',$scope.user._id,'networks/'+$scope.editMember._id,$scope.editMember,function (err,response){
	        if(err){

	        }else{
	          if(response.error){

	          }else{
	            $scope.show_form = false;
	            $scope.edit_form = false;
	          }
	        }
	      });
	    };




	  }]);
	};


/***/ }

});