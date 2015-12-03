webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * App module
	 * @desc: Main application setup
	 */
	var app = angular.module('app', [
	  /** THIRD party modules **/
	  'mm.foundation',
	  'angular-parallax',
	  'permission',
	  'ngLodash',
	  'angularMoment',
	  'ngSanitize',
	  'ui.select2',
	  'ui.tinymce',
	  /** core modules */
	  'app.core',
	  /** others modules */
	  'app.dashboard',
	  'app.homepage'
	]);

	/**
	 * load up our modules
	 */
	__webpack_require__(1);
	__webpack_require__(12);
	__webpack_require__(24);

	/**
	 * bootstrap our App
	 */
	angular.element(document).ready(function () {
	  angular.bootstrap(document, ['app']);
	});




/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Core module
	 * @desc:
	 */
	var appCore = angular.module('app.core', [
	  'ngCookies',
	  'ngAnimate',
	  'ngTouch',
	  'ui.router',
	  'base64'
	]);

	/** routes and run configs */
	__webpack_require__(3)(appCore);
	__webpack_require__(4)(appCore);

	/** controllers */
	__webpack_require__(5)(appCore);

	/** directives */
	__webpack_require__(6)(appCore);
	__webpack_require__(7)(appCore);
	__webpack_require__(2)(appCore);

	/** filters */
	__webpack_require__(8)(appCore);

	/** factories */
	__webpack_require__(9)(appCore);
	__webpack_require__(10)(appCore);
	__webpack_require__(11)(appCore);


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Slimscroll
	 * @module: app.core
	 * @desc: Application custom scrollbar
	 */
	module.exports = function (module) {
	  module.value('datetimepickerConfig', {});
	  module.directive('datetimepicker', ['$timeout', 'datetimepickerConfig','moment', function ($timeout, datetimepickerConfig,moment) {

	    Date.parseDate = function( input, format ){
	      return moment(input,format).toDate();
	    };
	    Date.prototype.dateFormat = function( format ){
	      return moment(this).format(format);
	    };

	    var options ={
	      inline:true,
	      minDate:0,
	      startDate:new Date(),
	      todayButton:true,
	      format:'DD.MM.YYYY h:mm a',
	      formatTime:'h:mm a',
	      formatDate:'DD.MM.YYYY'
	    };

	    if (datetimepickerConfig) { angular.extend(options, datetimepickerConfig); }

	    return {
	      restrict: 'A',
	      require: 'ngModel',
	      scope: {
	          ngModel: '=',
	          baseDate: '=',
	          dateTimepicker: '=',
	      },
	      link: function($scope, iElm, iAttrs,ngModel) {
	        $timeout(function () {

	          var opts = angular.extend({}, options);

	          angular.element(iElm).datetimepicker(
	            angular.extend(opts, ngModel.$modelValue?ngModel.$modelValue:{})
	          );
	        });
	      }
	    };
	  }]);
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Core run
	 * @module: app.core
	 */
	module.exports = function (module) {
	  module.run([
	    '$rootScope',
	    '$state',
	    '$stateParams',
	    '$http',
	    '$cookies',
	    'Permission',
	    'session',
	    function ($rootScope, $state, $stateParams,$http,$cookies,Permission,session) {

	        //Define anonymous role
	        Permission.defineRole('anonymous', function (stateParams) {
	            // If the returned value is *truthy* then the user has the role, otherwise they don't
	            return !session.exists();
	        });
	        
	        //Define admin role
	        Permission.defineRole('admin', function (stateParams) {
	            return session.is_admin;
	        });
	        
	        //Define user role
	        Permission.defineRole('user', function (stateParams) {
	            return session.exists();
	        });
	        
	        //For tokens and other requests.
	        $http.defaults.headers.common.Authorization = 'Bearer '+$cookies.c2cCookie;
	        //$http.defaults.withCredentials = true;
	        $rootScope.$state = $state;
	        $rootScope.$stateParams = $stateParams;
	        $rootScope.title = 'We care';
	    }
	  ]);
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Core routes
	 * @module: app.core
	 */
	module.exports = function (module) {
	  module.config([
	    '$locationProvider',
	    '$urlRouterProvider',
	    '$stateProvider',
	    '$controllerProvider',
	    '$compileProvider',
	    '$filterProvider',
	    '$provide',
	    'sessionProvider',

	    function ($locationProvider, $urlRouterProvider, $stateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide,session) {
	      /** store a reference to various provider functions */
	      module.controller = $controllerProvider.register;
	      module.directive  = $compileProvider.directive;
	      module.filter     = $filterProvider.register;
	      module.factory    = $provide.factory;
	      module.provider   = $provide.provider;
	      module.service    = $provide.service;
	      module.constant   = $provide.constant;
	      module.value      = $provide.value;

	      /** default route */
	      console.log(session.$get().exists(),session.$get().is_admin,session.$get().url);
	      $urlRouterProvider.otherwise(session.$get().url);

	      /** parent route */
	      $stateProvider
	      .state('default', {
	        abstract: true,
	        url: '',
	        templateUrl: 'modules/core/views/layouts/default.html'
	      })
	      .state('dashboard', {
	        abstract: true,
	        url: '',
	        templateUrl: 'modules/core/views/layouts/dashboard.html'
	      });


	    }
	  ]);
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Core setting controller
	 * @module: app.core 
	 */
	module.exports = function (module) {
	  module.controller('coreSettingsCtrl', [
	    '$scope',
	    '$rootScope',
	    '$window',
	    '$timeout',
	    '$cookies',
	    'viewport',
	    '$state',
	    'session',
	    '$urlRouter',    
	    function ($scope, $rootScope, $window, $timeout, $cookies, viewport,$state,session,$urlRouter) {
	      /** App Initial Settings */
	      $scope.core = {
	        name: 'CareToCall',
	        version: '0.0.1',
	        settings: {
	          fullScreen: false,
	          pageLoading: false,
	          headerFixed: true,
	          headerSearchForm: false,
	          sidebarLeftOpen: false,
	          sidebarLeftFixed: false,
	          sidebarLeftCollapse: viewport.width() >= 768 && viewport.width() < 992 ? true : false
	        },
	        screen: {
	          xs: viewport.width() < 768 ? true : false,
	          sm: viewport.width() >= 768 && viewport.width() < 992 ? true : false,
	          md: viewport.width() >= 992 && viewport.width() < 1200 ? true : false,
	          lg: viewport.width() >= 1200 ? true : false,
	          height: viewport.height(),
	          width: viewport.width()
	        }
	      };

	      /** hide sidebar and show loading indicator */
	      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
	        //console.log(toState.name, fromState.name);
	        // if(toState.name === fromState.name){
	        //   console.log('HELP');
	        //   return true;
	        // }

	        // $rootScope.title = 'Loading...';
	        
	        // var allowedState = session.allowedState;

	        // if(session.exists() === false){

	        //   if((allowedState.indexOf(toState.name) > -1)){//current state is allowed to be used;

	        //   }
	        //   else{
	        //     event.preventDefault();
	        //     $urlRouter.sync();
	            
	        //     $timeout(function(){
	        //       console.log(session.state,1);
	        //       $state.transitionTo(session.state,{},{
	        //         reload: true, inherit: false, notify: true
	        //       });

	        //     });
	        //   }  
	          
	        // }
	        // else{ // if session exists, dont let them go to allowed state
	        //   if((allowedState.indexOf(toState.name) > -1) && (toState.name !== fromState.name) ){//current state is allowed to be used;
	        //     event.preventDefault();
	        //     $urlRouter.sync();
	            
	        //     $timeout(function(){
	        //       console.log(session.state,2);
	        //       $state.transitionTo(session.state,{},{
	        //         reload: true, inherit: false, notify: true
	        //       });

	        //     });
	        //   }
	        // }

	        $scope.core.settings.sidebarLeftOpen = false;
	        $scope.core.settings.pageLoading = true;
	      });

	      /** show loading indicator */
	      $rootScope.$on('$stateChangeSuccess', function (event, current, previous) {
	        $scope.core.settings.pageLoading = false;
	        $rootScope.title = current.title;
	      });


	      /** On resize, update viewport variable */
	      angular.element($window).on('resize', function () {
	        $timeout.cancel($scope.resizing);

	        $scope.resizing = $timeout(function () {
	          $scope.core.screen.xs = viewport.width() < 768 ? true : false;
	          $scope.core.screen.sm = viewport.width() >= 768 && viewport.width() < 992 ? true : false;
	          $scope.core.screen.md = viewport.width() >= 992 && viewport.width() < 1200 ? true : false;
	          $scope.core.screen.lg = viewport.width() >= 1200 ? true : false;
	          $scope.core.screen.height = viewport.height();
	          $scope.core.screen.width = viewport.width();
	        }, 100);
	      });
	    }
	  ]);
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Page Loading indicator
	 * @module: app.core
	 * @desc: Application page loading indicator
	 */
	module.exports = function (module) {
	  module.directive('indicator', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
	    return {
	      restrict: 'A',
	      replace: true,
	      templateUrl: 'modules/core/views/partials/spinner.html',
	      link: function($scope, iElm, iAttrs) {
	        $timeout(function () {
	          var $wrapper = angular.element(iElm).parent('.spinner-wrapper'),
	              $spinner = angular.element(iElm);

	          /** show loading indicator */
	          $rootScope.$on('$stateChangeStart', function () {
	            $wrapper.addClass('show');
	          });

	          /** hide loading indicator */
	          $rootScope.$on('$stateChangeSuccess', function () {
	            $wrapper.removeClass('show');
	          });
	        });
	      }
	    };
	  }]);
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Page Loading indicator
	 * @module: app.core
	 * @desc: Application page loading indicator
	 */
	module.exports = function (module) {
	  module.directive('layerSlider', ['$timeout', function ($timeout) {
	    return {
	      restrict: 'A',
	      link: function($scope, iElm, iAttrs) {
	        $timeout(function () {
	          // jQuery(document).foundation(function(){});
	          
	          jQuery(iElm).layerSlider({
	            skin: 'v5',
	              skinsPath: '../assets/skins/'
	          });
	        });
	      }
	    };
	  }])

	  .directive('myIframe', function(){
	    var linkFn = function(scope, element, attrs) {
	        element.find('iframe').bind('load', function (event) {
	          event.target.contentWindow.scrollTo(0,400);
	        });
	    };
	    return {
	      restrict: 'EA',
	      scope: {
	        src:'@src',
	        height: '@height',
	        width: '@width',
	        scrolling: '@scrolling'
	      },
	      template: '<iframe class="frame" height="{{height}}" frameborder="0" width="{{width}}" frameborder="0" border="0" marginwidth="0" marginheight="0" scrolling="{{scrolling}}" ng:src="{{src}}"></iframe>',
	      link : linkFn
	    };
	  });
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Filters
	 * @module: app.core
	 * @desc: Capitalize wording
	 */
	module.exports = function (module) {
	  module.filter('capitalize', function () {
	    return function(input) {
	      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
	        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	      }) : '';
	    };
	  });
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Viewport Services
	 * @module: app.core
	 * @desc: Calculate application window width and height
	 */
	module.exports = function (module) {
	  module.factory('viewport', ['$window', function ($window) {
	    return {
	      height: function() {
	        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	      },
	      width: function() {
	        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	      }
	    };
	  }]);
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Viewport Services
	 * @module: app.core
	 * @desc: Calculate application window width and height
	 */
	//
	module.exports = function (module) {
		module.factory('api', ['$rootScope','$http', function ($rootScope,$http) {
			//var parseUrl = 'http://localhost:8080';
			var parseUrl = 'http://careapi.demo.hatchitup.com';

			var parseHeaders = {}; //set Headers for JWTTOKEN


			var GenerateUrl = function(theClass,object,objectId){
				if(object && objectId){
					return parseUrl+ '/' + theClass + '/'+ object + '/' + objectId;
				}
				else{
					if(object){
						return parseUrl+ '/' + theClass + '/'+ object;
					}
					else{
						return parseUrl+ '/' + theClass;
					}
				}
			};

			return {
				//Create a db object on server
				post: function(theClass,object, data, callback) {

					$http.post(
						GenerateUrl(theClass,object,false),

						data,
						{ headers: parseHeaders }
					)
					.success(function(response) {


						callback(null,response);
					})
					.error(function(response) {

						callback(true,response || 'Cannot submit data!');
					});
				},
				put: function(theClass,object, objectId, data, callback) {

					$http.put(
						GenerateUrl(theClass,object,objectId),

						data,
						{ headers: parseHeaders }
					)
					.success(function(response) {

						callback(null,response);
					})
					.error(function(response) {

						callback(true,response || 'There is some problem with your data.');
					});
				},
				//Get a db object by id
				get: function(theClass,object, objectId, query,callback) {

					var config = { headers: parseHeaders };
					if (query){
						config.params = query;
					}
					$http.get(
						GenerateUrl(theClass,object,objectId),

						config
					).success(function(response) {

						callback(null,response);
					}).error(function(response) {

						callback(true,response || 'Some error occured.');
					});
				},
				//Remove a db object
				delete: function(theClass,object, objectId, callback) {

					$http['delete']( //['delete'] to get around using delete js keyword
						GenerateUrl(theClass,object,objectId),
						{ headers: parseHeaders }
					).success(function(response) {

						callback(null,response);
					}).error(function(response) {

						callback(true,response || 'Some error occured.');
					});
				}
			};
	  	}]);
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Dashboard module
	 * @desc:
	 */
	var appDashboard = angular.module('app.dashboard', []);

	/** routes configs */
	__webpack_require__(13)(appDashboard);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Dashboard routes
	 * @module: app.dashboard
	 */
	module.exports = function (module) {
	  module.config([
	    '$locationProvider',
	    '$urlRouterProvider',
	    '$stateProvider',
	    '$controllerProvider',
	    '$compileProvider',
	    '$filterProvider',
	    '$provide',
	    function ($locationProvider, $urlRouterProvider, $stateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
	      /** store a reference to various provider functions */
	      module.controller = $controllerProvider.register;
	      module.directive  = $compileProvider.directive;
	      module.filter     = $filterProvider.register;
	      module.factory    = $provide.factory;
	      module.provider   = $provide.provider;
	      module.service    = $provide.service;
	      module.constant   = $provide.constant;
	      module.value      = $provide.value;

	      /** setup routes */
	      $stateProvider.state('dashboard.index', {
	        url: '/dashboard',
	        templateUrl: 'modules/dashboard/views/dashboard.html',
	        data: {
	          permissions: {
	            only: ['user'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(1, function () {
	              /** Controllers */
	              __webpack_require__(14)(module);
	              __webpack_require__(15)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });


	      $stateProvider.state('dashboard.reminders', {
	        url: '/reminders',
	        templateUrl: 'modules/dashboard/views/reminders.html',
	        data: {
	          permissions: {
	            only: ['user'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(2, function () {

	              /** Controllers */
	              __webpack_require__(14)(module);
	              __webpack_require__(16)(module);
	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });


	      $stateProvider.state('dashboard.members', {
	        url: '/members',
	        templateUrl: 'modules/dashboard/views/members.html',
	        data: {
	          permissions: {
	            only: ['user'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(3, function () {

	              /** Controllers */
	              __webpack_require__(14)(module);
	              __webpack_require__(17)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });

	      $stateProvider.state('dashboard.ecards', {
	        url: '/ecards',
	        templateUrl: 'modules/dashboard/views/ecards.html',
	        data: {
	          permissions: {
	            only: ['user'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(4, function () {

	              /** Controllers */
	              __webpack_require__(14)(module);
	              __webpack_require__(18)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });


	      $stateProvider.state('dashboard.history', {
	        url: '/history',
	        templateUrl: 'modules/dashboard/views/history.html',
	        data: {
	          permissions: {
	            only: ['user'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(5, function () {

	              /** Controllers */
	              __webpack_require__(14)(module);
	              __webpack_require__(19)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });


	      $stateProvider.state('dashboard.account', {
	        url: '/account',
	        templateUrl: 'modules/dashboard/views/account_settings.html',
	        data: {
	          permissions: {
	            only: ['user'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(6, function () {

	              /** Controllers */
	              __webpack_require__(14)(module);
	              __webpack_require__(20)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });

	      $stateProvider.state('dashboard.billing', {
	        url: '/billing',
	        templateUrl: 'modules/dashboard/views/billing_settings.html',
	        data: {
	          permissions: {
	            only: ['user'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(7, function () {

	              /** Controllers */
	              __webpack_require__(14)(module);
	              __webpack_require__(21)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });


	      $stateProvider.state('dashboard.admin_users', {
	        url: '/admin_users',
	        templateUrl: 'modules/dashboard/views/admin/users.html',
	        data: {
	          permissions: {
	            only: ['admin'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(8, function () {

	              /** Controllers */
	              __webpack_require__(22)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });



	      $stateProvider.state('dashboard.admin_plans', {
	        url: '/admin_plans',
	        templateUrl: 'modules/dashboard/views/admin/plans.html',
	        data: {
	          permissions: {
	            only: ['admin'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(8/* duplicate */, function () {

	              /** Controllers */
	              __webpack_require__(22)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });



	      $stateProvider.state('dashboard.admin_ecards', {
	        url: '/admin_ecards',
	        templateUrl: 'modules/dashboard/views/admin/ecards.html',
	        data: {
	          permissions: {
	            only: ['admin'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(8/* duplicate */, function () {

	              /** Controllers */
	              __webpack_require__(22)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });

	      $stateProvider.state('dashboard.admin_settings', {
	        url: '/admin_settings',
	        templateUrl: 'modules/dashboard/views/admin/settings.html',
	        data: {
	          permissions: {
	            only: ['admin'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(8/* duplicate */, function () {

	              /** Controllers */
	              __webpack_require__(22)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });





	      $stateProvider.state('dashboard.admin_index', {
	        url: '/admin_index',
	        templateUrl: 'modules/dashboard/views/admin/index.html',
	        data: {
	          permissions: {
	            only: ['admin'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(8/* duplicate */, function () {

	              /** Controllers */
	              __webpack_require__(22)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });


	      $stateProvider.state('dashboard.paypal', {
	        url: '/paypalConfirm',
	        templateUrl: 'modules/dashboard/views/paypal.html',
	        data: {
	          permissions: {
	            only: ['user'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(9, function () {

	              /** Controllers */
	              __webpack_require__(23)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });

	      $stateProvider.state('dashboard.paypal_cancel', {
	        url: '/paypalCancel',
	        templateUrl: 'modules/dashboard/views/paypal.html',
	        data: {
	          permissions: {
	            only: ['user'],
	            redirectTo: 'default.login'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(9/* duplicate */, function () {

	              /** Controllers */
	              __webpack_require__(23)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });








	    }
	  ]);
	};


/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Dashboard module
	 * @desc:
	 */
	var appDashboard = angular.module('app.homepage', []);

	/** routes configs */
	__webpack_require__(25)(appDashboard);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * homepage routes
	 * @module: app.homepage
	 */
	module.exports = function (module) {
	  module.config([
	    '$locationProvider',
	    '$urlRouterProvider',
	    '$stateProvider',
	    '$controllerProvider',
	    '$compileProvider',
	    '$filterProvider',
	    '$provide',
	    function ($locationProvider, $urlRouterProvider, $stateProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
	      /** store a reference to various provider functions */
	      module.controller = $controllerProvider.register;
	      module.directive  = $compileProvider.directive;
	      module.filter     = $filterProvider.register;
	      module.factory    = $provide.factory;
	      module.provider   = $provide.provider;
	      module.service    = $provide.service;
	      module.constant   = $provide.constant;
	      module.value      = $provide.value;

	      /** setup routes */
	      $stateProvider.state('default.homepage', {
	        url: '/',
	        templateUrl: 'modules/homepage/views/home.html',
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(10, function () {
	              
	              __webpack_require__(26)(module);
	              __webpack_require__(27)(module);

	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });
	      
	      $stateProvider.state('default.login', {
	        url: '/login',
	        templateUrl: 'modules/homepage/views/login.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(11, function () {

	              /** Controllers */
	              __webpack_require__(28)(module);
	              
	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });

	      
	      $stateProvider.state('default.resources', {
	        url: '/resources',
	        templateUrl: 'modules/homepage/views/resources.html',
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	              
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });
	      
	      $stateProvider.state('default.faq', {
	        url: '/faq',
	        templateUrl: 'modules/homepage/views/faq.html',
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	              
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });
	      
	      $stateProvider.state('default.contact', {
	        url: '/contact',
	        templateUrl: 'modules/homepage/views/contact.html',
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	              
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });
	      

	      

	      
	      $stateProvider.state('default.signup', {
	        url: '/signup',
	        templateUrl: 'modules/homepage/views/signup.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            __webpack_require__.e/* nsure */(12, function () {
	                
	              /** Controllers */
	              __webpack_require__(26)(module);
	            
	              deferred.resolve();
	            });

	            return deferred.promise;
	          }]
	        }
	      });


	      
	      $stateProvider.state('default.text', {
	        url: '/text-messaging',
	        templateUrl: 'modules/homepage/views/text-messaging.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	                
	              
	            
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });

	      $stateProvider.state('default.voice', {
	        url: '/live-voice-messages',
	        templateUrl: 'modules/homepage/views/live-voice-messages.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	                
	              
	            
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });

	      $stateProvider.state('default.medication', {
	        url: '/medication-management',
	        templateUrl: 'modules/homepage/views/medication-management.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	                
	              
	            
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });
	      
	      $stateProvider.state('default.phone', {
	        url: '/reassurance-phone-calls',
	        templateUrl: 'modules/homepage/views/reassurance-phone-calls.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	                
	              
	            
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });
	      
	      $stateProvider.state('default.private', {
	        url: '/private-support-network',
	        templateUrl: 'modules/homepage/views/private-support-network.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	                
	              
	            
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });
	      
	      $stateProvider.state('default.personalized', {
	        url: '/personalized-calendar',
	        templateUrl: 'modules/homepage/views/personalized-calendar.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	                
	              
	            
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });
	      

	      $stateProvider.state('default.who', {
	        url: '/who-is-using-caretocall',
	        templateUrl: 'modules/homepage/views/who-using.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	                
	              
	            
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });
	      

	      $stateProvider.state('default.testimonials', {
	        url: '/testimonials',
	        templateUrl: 'modules/homepage/views/testimonials.html',
	        data: {
	          permissions: {
	            only: ['anonymous'],
	            redirectTo: 'dashboard.index'
	          }
	        },
	        resolve: {
	          load: ['$q', '$rootScope', function ($q, $rootScope) {
	            var deferred = $q.defer();

	            !/* require.ensure */(function () {
	                
	              
	            
	              deferred.resolve();
	            }(__webpack_require__));

	            return deferred.promise;
	          }]
	        }
	      });
	      
	            
	      
	    }
	  ]);
	};

/***/ }
]);