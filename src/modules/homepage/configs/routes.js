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

            require.ensure([], function () {
              
              require('moduleDir/homepage/controllers/signup')(module);
              require('moduleDir/homepage/controllers/home')(module);

              deferred.resolve();
            }, 'homepage');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/homepage/controllers/login')(module);
              
              deferred.resolve();
            }, 'login');

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

            require.ensure([], function () {
              
              deferred.resolve();
            }, 'resources');

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

            require.ensure([], function () {
              
              deferred.resolve();
            }, 'faq');

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

            require.ensure([], function () {
              
              deferred.resolve();
            }, 'contact');

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

            require.ensure([], function () {
                
              /** Controllers */
              require('moduleDir/homepage/controllers/signup')(module);
            
              deferred.resolve();
            }, 'signup');

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

            require.ensure([], function () {
                
              
            
              deferred.resolve();
            }, 'text');

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

            require.ensure([], function () {
                
              
            
              deferred.resolve();
            }, 'voice');

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

            require.ensure([], function () {
                
              
            
              deferred.resolve();
            }, 'medication');

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

            require.ensure([], function () {
                
              
            
              deferred.resolve();
            }, 'phone');

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

            require.ensure([], function () {
                
              
            
              deferred.resolve();
            }, 'private');

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

            require.ensure([], function () {
                
              
            
              deferred.resolve();
            }, 'personalized');

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

            require.ensure([], function () {
                
              
            
              deferred.resolve();
            }, 'who');

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

            require.ensure([], function () {
                
              
            
              deferred.resolve();
            }, 'testimonials');

            return deferred.promise;
          }]
        }
      });
      
            
      
    }
  ]);
};