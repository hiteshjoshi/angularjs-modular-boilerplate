webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

<<<<<<< HEAD
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
=======
	//require('moduleDir/core/core');

	var m  = __webpack_require__(1);
	//namespace 
	var app = {};
	 
	//model 
	app.PageList = function() {
	    return m.request({method: "GET", url: "pages.json"});
	};
	 
	//controller 
	app.controller = function() {
	    var pages = app.PageList();
	    return {
	        pages: pages,
	        rotate: function() {
	            pages().push(pages().shift());
	        }
	    };
	};
	 
	//view 
	app.view = function(ctrl) {
	    return [
	        ctrl.pages().map(function(page) {
	            return m("a", {href: page.url}, page.title);
	        }),
	        m("button", {onclick: ctrl.rotate}, "Rotate links")
	    ];
	};
	 
	 
	//initialize 
	m.module(document.body, app);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {var m = (function app(window, undefined) {
		var OBJECT = "[object Object]", ARRAY = "[object Array]", STRING = "[object String]", FUNCTION = "function";
		var type = {}.toString;
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
		var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
		var noop = function() {}

		// caching commonly used variables
		var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

		// self invoking function needed because of the way mocks work
		function initialize(window){
			$document = window.document;
			$location = window.location;
			$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
			$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
		}

		initialize(window);


		/**
		 * @typedef {String} Tag
		 * A string that looks like -> div.classname#id[param=one][param2=two]
		 * Which describes a DOM node
		 */

		/**
		 *
		 * @param {Tag} The DOM node tag
		 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
		 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
		 *
		 */
		function m() {
			var args = [].slice.call(arguments);
			var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1] || "view" in args[1]) && !("subtree" in args[1]);
			var attrs = hasAttrs ? args[1] : {};
			var classAttrName = "class" in attrs ? "class" : "className";
			var cell = {tag: "div", attrs: {}};
			var match, classes = [];
			if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string")
			while (match = parser.exec(args[0])) {
				if (match[1] === "" && match[2]) cell.tag = match[2];
				else if (match[1] === "#") cell.attrs.id = match[2];
				else if (match[1] === ".") classes.push(match[2]);
				else if (match[3][0] === "[") {
					var pair = attrParser.exec(match[3]);
					cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
				}
			}

			var children = hasAttrs ? args.slice(2) : args.slice(1);
			if (children.length === 1 && type.call(children[0]) === ARRAY) {
				cell.children = children[0]
			}
			else {
				cell.children = children
			}
			
			for (var attrName in attrs) {
				if (attrs.hasOwnProperty(attrName)) {
					if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
						classes.push(attrs[attrName])
						cell.attrs[attrName] = "" //create key in correct iteration order
					}
					else cell.attrs[attrName] = attrs[attrName]
				}
			}
			if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");
			
			return cell
		}
		function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
			//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
			//the diff algorithm can be summarized as this:
			//1 - compare `data` and `cached`
			//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
			//3 - recursively apply this algorithm for every array and for the children of every virtual element

			//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
			//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
			//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
			//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
			//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

			//`parentElement` is a DOM element used for W3C DOM API calls
			//`parentTag` is only used for handling a corner case for textarea values
			//`parentCache` is used to remove nodes in some multi-node cases
			//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
			//`data` and `cached` are, respectively, the new and old nodes being diffed
			//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
			//`editable` is a flag that indicates whether an ancestor is contenteditable
			//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
			//`configs` is a list of config functions to run after the topmost `build` call finishes running

			//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
			//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
			//- it simplifies diffing code
			//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
			try {if (data == null || data.toString() == null) data = "";} catch (e) {data = ""}
			if (data.subtree === "retain") return cached;
			var cachedType = type.call(cached), dataType = type.call(data);
			if (cached == null || cachedType !== dataType) {
				if (cached != null) {
					if (parentCache && parentCache.nodes) {
						var offset = index - parentIndex;
						var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
						clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
					}
					else if (cached.nodes) clear(cached.nodes, cached)
				}
				cached = new data.constructor;
				if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
				cached.nodes = []
			}

			if (dataType === ARRAY) {
				//recursively flatten array
				for (var i = 0, len = data.length; i < len; i++) {
					if (type.call(data[i]) === ARRAY) {
						data = data.concat.apply([], data);
						i-- //check current index again and flatten until there are no more nested arrays at that index
						len = data.length
					}
				}
				
				var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

				//keys algorithm: sort elements without recreating them if keys are present
				//1) create a map of all existing keys, and mark all for deletion
				//2) add new keys to map and mark them for addition
				//3) if key exists in new list, change action from deletion to a move
				//4) for each key, handle its corresponding action as marked in previous steps
				var DELETION = 1, INSERTION = 2 , MOVE = 3;
				var existing = {}, shouldMaintainIdentities = false;
				for (var i = 0; i < cached.length; i++) {
					if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
						shouldMaintainIdentities = true;
						existing[cached[i].attrs.key] = {action: DELETION, index: i}
					}
				}
				
				var guid = 0
				for (var i = 0, len = data.length; i < len; i++) {
					if (data[i] && data[i].attrs && data[i].attrs.key != null) {
						for (var j = 0, len = data.length; j < len; j++) {
							if (data[j] && data[j].attrs && data[j].attrs.key == null) data[j].attrs.key = "__mithril__" + guid++
						}
						break
					}
				}
				
				if (shouldMaintainIdentities) {
					var keysDiffer = false
					if (data.length != cached.length) keysDiffer = true
					else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
						if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
							keysDiffer = true
							break
						}
					}
					
					if (keysDiffer) {
						for (var i = 0, len = data.length; i < len; i++) {
							if (data[i] && data[i].attrs) {
								if (data[i].attrs.key != null) {
									var key = data[i].attrs.key;
									if (!existing[key]) existing[key] = {action: INSERTION, index: i};
									else existing[key] = {
										action: MOVE,
										index: i,
										from: existing[key].index,
										element: cached.nodes[existing[key].index] || $document.createElement("div")
									}
								}
							}
						}
						var actions = []
						for (var prop in existing) actions.push(existing[prop])
						var changes = actions.sort(sortChanges);
						var newCached = new Array(cached.length)
						newCached.nodes = cached.nodes.slice()

						for (var i = 0, change; change = changes[i]; i++) {
							if (change.action === DELETION) {
								clear(cached[change.index].nodes, cached[change.index]);
								newCached.splice(change.index, 1)
							}
							if (change.action === INSERTION) {
								var dummy = $document.createElement("div");
								dummy.key = data[change.index].attrs.key;
								parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
								newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
								newCached.nodes[change.index] = dummy
							}

							if (change.action === MOVE) {
								if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
									parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
								}
								newCached[change.index] = cached[change.from]
								newCached.nodes[change.index] = change.element
							}
						}
						cached = newCached;
					}
				}
				//end key algorithm

				for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
					//diff each item in the array
					var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
					if (item === undefined) continue;
					if (!item.nodes.intact) intact = false;
					if (item.$trusted) {
						//fix offset of next element if item was a trusted string w/ more than one html element
						//the first clause in the regexp matches elements
						//the second clause (after the pipe) matches text nodes
						subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || [0]).length
					}
					else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
					cached[cacheCount++] = item
				}
				if (!intact) {
					//diff the array itself
					
					//update the list of DOM nodes by collecting the nodes from each item
					for (var i = 0, len = data.length; i < len; i++) {
						if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
					}
					//remove items from the end of the array if the new array is shorter than the old one
					//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
					for (var i = 0, node; node = cached.nodes[i]; i++) {
						if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
					}
					if (data.length < cached.length) cached.length = data.length;
					cached.nodes = nodes
				}
			}
			else if (data != null && dataType === OBJECT) {
				var views = [], controllers = []
				while (data.view) {
					var view = data.view.$original || data.view
					var controllerIndex = m.redraw.strategy() == "diff" && cached.views ? cached.views.indexOf(view) : -1
					var controller = controllerIndex > -1 ? cached.controllers[controllerIndex] : new (data.controller || noop)
					var key = data && data.attrs && data.attrs.key
					data = pendingRequests == 0 || (cached && cached.controllers && cached.controllers.indexOf(controller) > -1) ? data.view(controller) : {tag: "placeholder"}
					if (data.subtree === "retain") return cached;
					if (key) {
						if (!data.attrs) data.attrs = {}
						data.attrs.key = key
					}
					if (controller.onunload) unloaders.push({controller: controller, handler: controller.onunload})
					views.push(view)
					controllers.push(controller)
				}
				if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.")
				if (!data.attrs) data.attrs = {};
				if (!cached.attrs) cached.attrs = {};

				var dataAttrKeys = Object.keys(data.attrs)
				var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)
				//if an element is different enough from the one in cache, recreate it
				if (data.tag != cached.tag || dataAttrKeys.sort().join() != Object.keys(cached.attrs).sort().join() || data.attrs.id != cached.attrs.id || data.attrs.key != cached.attrs.key || (m.redraw.strategy() == "all" && (!cached.configContext || cached.configContext.retain !== true)) || (m.redraw.strategy() == "diff" && cached.configContext && cached.configContext.retain === false)) {
					if (cached.nodes.length) clear(cached.nodes);
					if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
					if (cached.controllers) {
						for (var i = 0, controller; controller = cached.controllers[i]; i++) {
							if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop})
						}
					}
				}
				if (type.call(data.tag) != STRING) return;

				var node, isNew = cached.nodes.length === 0;
				if (data.attrs.xmlns) namespace = data.attrs.xmlns;
				else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
				else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
				
				if (isNew) {
					if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
					else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
					cached = {
						tag: data.tag,
						//set attributes first, then create children
						attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
						children: data.children != null && data.children.length > 0 ?
							build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
							data.children,
						nodes: [node]
					};
					if (controllers.length) {
						cached.views = views
						cached.controllers = controllers
						for (var i = 0, controller; controller = controllers[i]; i++) {
							if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old
							if (pendingRequests && controller.onunload) {
								var onunload = controller.onunload
								controller.onunload = noop
								controller.onunload.$old = onunload
							}
						}
					}
					
					if (cached.children && !cached.children.nodes) cached.children.nodes = [];
					//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
					if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
					parentElement.insertBefore(node, parentElement.childNodes[index] || null)
				}
				else {
					node = cached.nodes[0];
					if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
					cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
					cached.nodes.intact = true;
					if (controllers.length) {
						cached.views = views
						cached.controllers = controllers
					}
					if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
				}
				//schedule configs to be called. They are called after `build` finishes running
				if (typeof data.attrs["config"] === FUNCTION) {
					var context = cached.configContext = cached.configContext || {};

					// bind
					var callback = function(data, args) {
						return function() {
							return data.attrs["config"].apply(data, args)
						}
					};
					configs.push(callback(data, [node, !isNew, context, cached]))
				}
			}
			else if (typeof data != FUNCTION) {
				//handle text nodes
				var nodes;
				if (cached.nodes.length === 0) {
					if (data.$trusted) {
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						nodes = [$document.createTextNode(data)];
						if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
					}
					cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
					cached.nodes = nodes
				}
				else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
					nodes = cached.nodes;
					if (!editable || editable !== $document.activeElement) {
						if (data.$trusted) {
							clear(nodes, cached);
							nodes = injectHTML(parentElement, index, data)
						}
						else {
							//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
							//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
							if (parentTag === "textarea") parentElement.value = data;
							else if (editable) editable.innerHTML = data;
							else {
								if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
									clear(cached.nodes, cached);
									nodes = [$document.createTextNode(data)]
								}
								parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
								nodes[0].nodeValue = data
							}
						}
					}
					cached = new data.constructor(data);
					cached.nodes = nodes
				}
				else cached.nodes.intact = true
			}

			return cached
		}
		function sortChanges(a, b) {return a.action - b.action || a.index - b.index}
		function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
			for (var attrName in dataAttrs) {
				var dataAttr = dataAttrs[attrName];
				var cachedAttr = cachedAttrs[attrName];
				if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
					cachedAttrs[attrName] = dataAttr;
					try {
						//`config` isn't a real attributes, so ignore it
						if (attrName === "config" || attrName == "key") continue;
						//hook event handlers to the auto-redrawing system
						else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
							node[attrName] = autoredraw(dataAttr, node)
						}
						//handle `style: {...}`
						else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
							for (var rule in dataAttr) {
								if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
							}
							for (var rule in cachedAttr) {
								if (!(rule in dataAttr)) node.style[rule] = ""
							}
						}
						//handle SVG
						else if (namespace != null) {
							if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
							else if (attrName === "className") node.setAttribute("class", dataAttr);
							else node.setAttribute(attrName, dataAttr)
						}
						//handle cases that are properties (but ignore cases where we should use setAttribute instead)
						//- list and form are typically used as strings, but are DOM element references in js
						//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
						else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type" || attrName === "width" || attrName === "height")) {
							//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
							if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
						}
						else node.setAttribute(attrName, dataAttr)
					}
					catch (e) {
						//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
						if (e.message.indexOf("Invalid argument") < 0) throw e
					}
				}
				//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
				else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
					node.value = dataAttr
				}
			}
			return cachedAttrs
		}
		function clear(nodes, cached) {
			for (var i = nodes.length - 1; i > -1; i--) {
				if (nodes[i] && nodes[i].parentNode) {
					try {nodes[i].parentNode.removeChild(nodes[i])}
					catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
					cached = [].concat(cached);
					if (cached[i]) unload(cached[i])
				}
			}
			if (nodes.length != 0) nodes.length = 0
		}
		function unload(cached) {
			if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) {
				cached.configContext.onunload();
				cached.configContext.onunload = null
			}
			if (cached.controllers) {
				for (var i = 0, controller; controller = cached.controllers[i]; i++) {
					if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: noop});
				}
			}
			if (cached.children) {
				if (type.call(cached.children) === ARRAY) {
					for (var i = 0, child; child = cached.children[i]; i++) unload(child)
				}
				else if (cached.children.tag) unload(cached.children)
			}
		}
		function injectHTML(parentElement, index, data) {
			var nextSibling = parentElement.childNodes[index];
			if (nextSibling) {
				var isElement = nextSibling.nodeType != 1;
				var placeholder = $document.createElement("span");
				if (isElement) {
					parentElement.insertBefore(placeholder, nextSibling || null);
					placeholder.insertAdjacentHTML("beforebegin", data);
					parentElement.removeChild(placeholder)
				}
				else nextSibling.insertAdjacentHTML("beforebegin", data)
			}
			else parentElement.insertAdjacentHTML("beforeend", data);
			var nodes = [];
			while (parentElement.childNodes[index] !== nextSibling) {
				nodes.push(parentElement.childNodes[index]);
				index++
			}
			return nodes
		}
		function autoredraw(callback, object) {
			return function(e) {
				e = e || event;
				m.redraw.strategy("diff");
				m.startComputation();
				try {return callback.call(object, e)}
				finally {
					endFirstComputation()
				}
			}
		}

		var html;
		var documentNode = {
			appendChild: function(node) {
				if (html === undefined) html = $document.createElement("html");
				if ($document.documentElement && $document.documentElement !== node) {
					$document.replaceChild(node, $document.documentElement)
				}
				else $document.appendChild(node);
				this.childNodes = $document.childNodes
			},
			insertBefore: function(node) {
				this.appendChild(node)
			},
			childNodes: []
		};
		var nodeCache = [], cellCache = {};
		m.render = function(root, cell, forceRecreation) {
			var configs = [];
			if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
			var id = getCellCacheKey(root);
			var isDocumentRoot = root === $document;
			var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
			if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
			if (cellCache[id] === undefined) clear(node.childNodes);
			if (forceRecreation === true) reset(root);
			cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
			for (var i = 0, len = configs.length; i < len; i++) configs[i]()
		};
		function getCellCacheKey(element) {
			var index = nodeCache.indexOf(element);
			return index < 0 ? nodeCache.push(element) - 1 : index
		}

		m.trust = function(value) {
			value = new String(value);
			value.$trusted = true;
			return value
		};

		function gettersetter(store) {
			var prop = function() {
				if (arguments.length) store = arguments[0];
				return store
			};

			prop.toJSON = function() {
				return store
			};

			return prop
		}

		m.prop = function (store) {
			//note: using non-strict equality check here because we're checking if store is null OR undefined
			if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
				return propify(store)
			}

			return gettersetter(store)
		};

		var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePreRedrawHook = null, computePostRedrawHook = null, prevented = false, topComponent, unloaders = [];
		var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
		function parameterize(component, args) {
			var controller = function() {
				return (component.controller || noop).apply(this, args) || this
			}
			var view = function(ctrl) {
				if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1))
				return component.view.apply(component, args ? [ctrl].concat(args) : [ctrl])
			}
			view.$original = component.view
			var output = {controller: controller, view: view}
			if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
			return output
		}
		m.component = function(component) {
			return parameterize(component, [].slice.call(arguments, 1))
		}
		m.mount = m.module = function(root, component) {
			if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
			var index = roots.indexOf(root);
			if (index < 0) index = roots.length;
			
			var isPrevented = false;
			var event = {preventDefault: function() {
				isPrevented = true;
				computePreRedrawHook = computePostRedrawHook = null;
			}};
			for (var i = 0, unloader; unloader = unloaders[i]; i++) {
				unloader.handler.call(unloader.controller, event)
				unloader.controller.onunload = null
			}
			if (isPrevented) {
				for (var i = 0, unloader; unloader = unloaders[i]; i++) unloader.controller.onunload = unloader.handler
			}
			else unloaders = []
			
			if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
				controllers[index].onunload(event)
			}
			
			if (!isPrevented) {
				m.redraw.strategy("all");
				m.startComputation();
				roots[index] = root;
				if (arguments.length > 2) component = subcomponent(component, [].slice.call(arguments, 2))
				var currentComponent = topComponent = component = component || {controller: function() {}};
				var constructor = component.controller || noop
				var controller = new constructor;
				//controllers may call m.mount recursively (via m.route redirects, for example)
				//this conditional ensures only the last recursive m.mount call is applied
				if (currentComponent === topComponent) {
					controllers[index] = controller;
					components[index] = component
				}
				endFirstComputation();
				return controllers[index]
			}
		};
		var redrawing = false
		m.redraw = function(force) {
			if (redrawing) return
			redrawing = true
			//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
			//lastRedrawID is null if it's the first redraw and not an event handler
			if (lastRedrawId && force !== true) {
				//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
				//when rAF: always reschedule redraw
				if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
					if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
					lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
				}
			}
			else {
				redraw();
				lastRedrawId = $requestAnimationFrame(function() {lastRedrawId = null}, FRAME_BUDGET)
			}
			redrawing = false
		};
		m.redraw.strategy = m.prop();
		function redraw() {
			if (computePreRedrawHook) {
				computePreRedrawHook()
				computePreRedrawHook = null
			}
			for (var i = 0, root; root = roots[i]; i++) {
				if (controllers[i]) {
					var args = components[i].controller && components[i].controller.$$args ? [controllers[i]].concat(components[i].controller.$$args) : [controllers[i]]
					m.render(root, components[i].view ? components[i].view(controllers[i], args) : "")
				}
			}
			//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
			if (computePostRedrawHook) {
				computePostRedrawHook();
				computePostRedrawHook = null
			}
			lastRedrawId = null;
			lastRedrawCallTime = new Date;
			m.redraw.strategy("diff")
		}

		var pendingRequests = 0;
		m.startComputation = function() {pendingRequests++};
		m.endComputation = function() {
			pendingRequests = Math.max(pendingRequests - 1, 0);
			if (pendingRequests === 0) m.redraw()
		};
		var endFirstComputation = function() {
			if (m.redraw.strategy() == "none") {
				pendingRequests--
				m.redraw.strategy("diff")
			}
			else m.endComputation();
		}

		m.withAttr = function(prop, withAttrCallback) {
			return function(e) {
				e = e || event;
				var currentTarget = e.currentTarget || this;
				withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
			}
		};

		//routing
		var modes = {pathname: "", hash: "#", search: "?"};
		var redirect = noop, routeParams, currentRoute, isDefaultRoute = false;
		m.route = function() {
			//m.route()
			if (arguments.length === 0) return currentRoute;
			//m.route(el, defaultRoute, routes)
			else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
				var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
				redirect = function(source) {
					var path = currentRoute = normalizeRoute(source);
					if (!routeByValue(root, router, path)) {
						if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route")
						isDefaultRoute = true
						m.route(defaultRoute, true)
						isDefaultRoute = false
					}
				};
				var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
				window[listener] = function() {
					var path = $location[m.route.mode]
					if (m.route.mode === "pathname") path += $location.search
					if (currentRoute != normalizeRoute(path)) {
						redirect(path)
					}
				};
				computePreRedrawHook = setScroll;
				window[listener]()
			}
			//config: m.route
			else if (arguments[0].addEventListener || arguments[0].attachEvent) {
				var element = arguments[0];
				var isInitialized = arguments[1];
				var context = arguments[2];
				var vdom = arguments[3];
				element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
				if (element.addEventListener) {
					element.removeEventListener("click", routeUnobtrusive);
					element.addEventListener("click", routeUnobtrusive)
				}
				else {
					element.detachEvent("onclick", routeUnobtrusive);
					element.attachEvent("onclick", routeUnobtrusive)
				}
			}
			//m.route(route, params, shouldReplaceHistoryEntry)
			else if (type.call(arguments[0]) === STRING) {
				var oldRoute = currentRoute;
				currentRoute = arguments[0];
				var args = arguments[1] || {}
				var queryIndex = currentRoute.indexOf("?")
				var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
				for (var i in args) params[i] = args[i]
				var querystring = buildQueryString(params)
				var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
				if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

				var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];

				if (window.history.pushState) {
					computePreRedrawHook = setScroll
					computePostRedrawHook = function() {
						window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
					};
					redirect(modes[m.route.mode] + currentRoute)
				}
				else {
					$location[m.route.mode] = currentRoute
					redirect(modes[m.route.mode] + currentRoute)
				}
			}
		};
		m.route.param = function(key) {
			if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
			return routeParams[key]
		};
		m.route.mode = "search";
		function normalizeRoute(route) {
			return route.slice(modes[m.route.mode].length)
		}
		function routeByValue(root, router, path) {
			routeParams = {};

			var queryStart = path.indexOf("?");
			if (queryStart !== -1) {
				routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
				path = path.substr(0, queryStart)
			}

			// Get all routes and check if there's
			// an exact match for the current path
			var keys = Object.keys(router);
			var index = keys.indexOf(path);
			if(index !== -1){
				m.mount(root, router[keys [index]]);
				return true;
			}

			for (var route in router) {
				if (route === path) {
					m.mount(root, router[route]);
					return true
				}

				var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

				if (matcher.test(path)) {
					path.replace(matcher, function() {
						var keys = route.match(/:[^\/]+/g) || [];
						var values = [].slice.call(arguments, 1, -2);
						for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						m.mount(root, router[route])
					});
					return true
				}
			}
		}
		function routeUnobtrusive(e) {
			e = e || event;
			if (e.ctrlKey || e.metaKey || e.which === 2) return;
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			var currentTarget = e.currentTarget || e.srcElement;
			var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
			while (currentTarget && currentTarget.nodeName.toUpperCase() != "A") currentTarget = currentTarget.parentNode
			m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
		}
		function setScroll() {
			if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
			else window.scrollTo(0, 0)
		}
		function buildQueryString(object, prefix) {
			var duplicates = {}
			var str = []
			for (var prop in object) {
				var key = prefix ? prefix + "[" + prop + "]" : prop
				var value = object[prop]
				var valueType = type.call(value)
				var pair = (value === null) ? encodeURIComponent(key) :
					valueType === OBJECT ? buildQueryString(value, key) :
					valueType === ARRAY ? value.reduce(function(memo, item) {
						if (!duplicates[key]) duplicates[key] = {}
						if (!duplicates[key][item]) {
							duplicates[key][item] = true
							return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item))
						}
						return memo
					}, []).join("&") :
					encodeURIComponent(key) + "=" + encodeURIComponent(value)
				if (value !== undefined) str.push(pair)
			}
			return str.join("&")
		}
		function parseQueryString(str) {
			if (str.charAt(0) === "?") str = str.substring(1);
			
			var pairs = str.split("&"), params = {};
			for (var i = 0, len = pairs.length; i < len; i++) {
				var pair = pairs[i].split("=");
				var key = decodeURIComponent(pair[0])
				var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
				if (params[key] != null) {
					if (type.call(params[key]) !== ARRAY) params[key] = [params[key]]
					params[key].push(value)
				}
				else params[key] = value
			}
			return params
		}
		m.route.buildQueryString = buildQueryString
		m.route.parseQueryString = parseQueryString
		
		function reset(root) {
			var cacheKey = getCellCacheKey(root);
			clear(root.childNodes, cellCache[cacheKey]);
			cellCache[cacheKey] = undefined
		}

		m.deferred = function () {
			var deferred = new Deferred();
			deferred.promise = propify(deferred.promise);
			return deferred
		};
		function propify(promise, initialValue) {
			var prop = m.prop(initialValue);
			promise.then(prop);
			prop.then = function(resolve, reject) {
				return propify(promise.then(resolve, reject), initialValue)
			};
			return prop
		}
		//Promiz.mithril.js | Zolmeister | MIT
		//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
		//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
		//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
		function Deferred(successCallback, failureCallback) {
			var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
			var self = this, state = 0, promiseValue = 0, next = [];

			self["promise"] = {};

			self["resolve"] = function(value) {
				if (!state) {
					promiseValue = value;
					state = RESOLVING;

					fire()
				}
				return this
			};

			self["reject"] = function(value) {
				if (!state) {
					promiseValue = value;
					state = REJECTING;

					fire()
				}
				return this
			};

			self.promise["then"] = function(successCallback, failureCallback) {
				var deferred = new Deferred(successCallback, failureCallback);
				if (state === RESOLVED) {
					deferred.resolve(promiseValue)
				}
				else if (state === REJECTED) {
					deferred.reject(promiseValue)
				}
				else {
					next.push(deferred)
				}
				return deferred.promise
			};

			function finish(type) {
				state = type || REJECTED;
				next.map(function(deferred) {
					state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue)
				})
			}

			function thennable(then, successCallback, failureCallback, notThennableCallback) {
				if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
					try {
						// count protects against abuse calls from spec checker
						var count = 0;
						then.call(promiseValue, function(value) {
							if (count++) return;
							promiseValue = value;
							successCallback()
						}, function (value) {
							if (count++) return;
							promiseValue = value;
							failureCallback()
						})
					}
					catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						failureCallback()
					}
				} else {
					notThennableCallback()
				}
			}

			function fire() {
				// check if it's a thenable
				var then;
				try {
					then = promiseValue && promiseValue.then
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					state = REJECTING;
					return fire()
				}
				thennable(then, function() {
					state = RESOLVING;
					fire()
				}, function() {
					state = REJECTING;
					fire()
				}, function() {
					try {
						if (state === RESOLVING && typeof successCallback === FUNCTION) {
							promiseValue = successCallback(promiseValue)
						}
						else if (state === REJECTING && typeof failureCallback === "function") {
							promiseValue = failureCallback(promiseValue);
							state = RESOLVING
						}
					}
					catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						return finish()
					}

					if (promiseValue === self) {
						promiseValue = TypeError();
						finish()
					}
					else {
						thennable(then, function () {
							finish(RESOLVED)
						}, finish, function () {
							finish(state === RESOLVING && RESOLVED)
						})
					}
				})
			}
		}
		m.deferred.onerror = function(e) {
			if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e
		};

		m.sync = function(args) {
			var method = "resolve";
			function synchronizer(pos, resolved) {
				return function(value) {
					results[pos] = value;
					if (!resolved) method = "reject";
					if (--outstanding === 0) {
						deferred.promise(results);
						deferred[method](results)
					}
					return value
				}
			}

			var deferred = m.deferred();
			var outstanding = args.length;
			var results = new Array(outstanding);
			if (args.length > 0) {
				for (var i = 0; i < args.length; i++) {
					args[i].then(synchronizer(i, true), synchronizer(i, false))
				}
			}
			else deferred.resolve([]);

			return deferred.promise
		};
		function identity(value) {return value}

		function ajax(options) {
			if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
				var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
				var script = $document.createElement("script");

				window[callbackKey] = function(resp) {
					script.parentNode.removeChild(script);
					options.onload({
						type: "load",
						target: {
							responseText: resp
						}
					});
					window[callbackKey] = undefined
				};

				script.onerror = function(e) {
					script.parentNode.removeChild(script);

					options.onerror({
						type: "error",
						target: {
							status: 500,
							responseText: JSON.stringify({error: "Error making jsonp request"})
						}
					});
					window[callbackKey] = undefined;

					return false
				};

				script.onload = function(e) {
					return false
				};

				script.src = options.url
					+ (options.url.indexOf("?") > 0 ? "&" : "?")
					+ (options.callbackKey ? options.callbackKey : "callback")
					+ "=" + callbackKey
					+ "&" + buildQueryString(options.data || {});
				$document.body.appendChild(script)
			}
			else {
				var xhr = new window.XMLHttpRequest;
				xhr.open(options.method, options.url, true, options.user, options.password);
				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4) {
						if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
						else options.onerror({type: "error", target: xhr})
					}
				};
				if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
				}
				if (options.deserialize === JSON.parse) {
					xhr.setRequestHeader("Accept", "application/json, text/*");
				}
				if (typeof options.config === FUNCTION) {
					var maybeXhr = options.config(xhr, options);
					if (maybeXhr != null) xhr = maybeXhr
				}

				var data = options.method === "GET" || !options.data ? "" : options.data
				if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
					throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
				}
				xhr.send(data);
				return xhr
			}
		}
		function bindData(xhrOptions, data, serialize) {
			if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
				var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
				var querystring = buildQueryString(data);
				xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
			}
			else xhrOptions.data = serialize(data);
			return xhrOptions
		}
		function parameterizeUrl(url, data) {
			var tokens = url.match(/:[a-z]\w+/gi);
			if (tokens && data) {
				for (var i = 0; i < tokens.length; i++) {
					var key = tokens[i].slice(1);
					url = url.replace(tokens[i], data[key]);
					delete data[key]
				}
			}
			return url
		}

		m.request = function(xhrOptions) {
			if (xhrOptions.background !== true) m.startComputation();
			var deferred = new Deferred();
			var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
			var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
			var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
			var extract = isJSONP ? function(jsonp) {return jsonp.responseText} : xhrOptions.extract || function(xhr) {
				return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
			};
			xhrOptions.method = (xhrOptions.method || 'GET').toUpperCase();
			xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
			xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
			xhrOptions.onload = xhrOptions.onerror = function(e) {
				try {
					e = e || event;
					var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
					var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
					if (e.type === "load") {
						if (type.call(response) === ARRAY && xhrOptions.type) {
							for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
						}
						else if (xhrOptions.type) response = new xhrOptions.type(response)
					}
					deferred[e.type === "load" ? "resolve" : "reject"](response)
				}
				catch (e) {
					m.deferred.onerror(e);
					deferred.reject(e)
				}
				if (xhrOptions.background !== true) m.endComputation()
			};
			ajax(xhrOptions);
			deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
			return deferred.promise
		};

		//testing API
		m.deps = function(mock) {
			initialize(window = mock || window);
			return window;
		};
		//for internal testing only, do not use `m.deps.factory`
		m.deps.factory = app;

		return m
	})(typeof window != "undefined" ? window : {});

	if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
	else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {return m}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))
>>>>>>> f8edfb23ff040fa16ba94d217d1f05edc02fd8cc

/***/ }
]);