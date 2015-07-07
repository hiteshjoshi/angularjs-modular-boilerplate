'use strict';

module.exports = function (module) {
	module.factory('session', ['$rootScope','api','$cookies','$base64','$state', function ($rootScope,api,$cookies,$base64,$state) {
		
		return {
			exists: function() {
				function urlBase64Decode(str) {
				      var output = str.replace('-', '+').replace('_', '/');
				      switch (output.length % 4) {
				          case 0:
				              break;
				          case 2:
				              output += '==';
				              break;
				          case 3:
				              output += '=';
				              break;
				          default:
				              throw 'Illegal base64url string!';
				      }
				      return $base64.decode(output);
				  }

				function getUserFromToken() {
				      var token = $cookies.c2cCookie;
				      var user = {};
				      if (typeof token !== 'undefined') {
				          var encoded = token.split('.')[1];
				          user = JSON.parse(urlBase64Decode(encoded));
				      }
				      else{
				        user = null;
				        user = false;
				      }
				      return user;
				  }

	          /*** check if a user is loggedIn ***/
		      $rootScope.user = getUserFromToken();
		      $rootScope.logout = function(){
		      	api.post('logout',false,false,function(){
		      		//$cookies.remove('c2cCookie');
		      		$rootScope.token = null;
		      		delete $cookies.c2cCookie;
		      		//window.location.reload();
		      		$state.go('default.homepage');
		      		window.location.reload();
		      	});
		      };
		      $rootScope.token = $cookies.c2cCookie;
		      if($rootScope.token && $rootScope.user){
		      	return true;
		      }
		      else{
		      	return false;
		      }
			},
			url : ($rootScope.token && $rootScope.user) ? 'dashboard':'/',
			is_admin : ($rootScope.token && $rootScope.user && $rootScope.user.is_admin) ? true:false,
			state : ($rootScope.token && $rootScope.user) ? 'dashboard.index':'default.homepage',
			allowedState:['default.homepage','default.login','default.signup','default.resources','default.faq','default.contact'],
			socket: function() {
				$rootScope.socket = null;

				return $rootScope.socket;
				
			}
		};
  	}]);
};