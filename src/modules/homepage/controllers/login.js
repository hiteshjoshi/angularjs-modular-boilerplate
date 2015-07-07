'use strict';

/**
 * Activities feed controller
 * @module: app.dashboard
 * @desc: Show some activity feed
 */
module.exports = function (module) {
  module.controller('loginCtrl', ['$scope','api','$http','$cookieStore',function ($scope,api,$http,$cookieStore) {
  	$scope.errors = false;
  	$scope.login = function () {

  		api.post('users','login',{email:$scope.email,password:$scope.password},function(err,response){
  			if(err || response.error){
  				$scope.errors = true;
  				$scope.success = false;
  				$scope.errorMessage = response.userMessage || 'Server error.';
  			}
  			else{
  				$scope.errors = false;
  				$scope.success = true;
  				$scope.successMessage = response.userMessage || 'Success.';
          if(response.data && response.data.token){
    				$cookieStore.put('c2cCookie',response.data.token);
  				  window.location.reload();
    			}
  			}
  		});
  	};

  }]);
};
