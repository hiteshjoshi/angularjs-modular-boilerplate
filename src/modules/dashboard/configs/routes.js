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

            require.ensure([], function () {
              /** Controllers */
              require('moduleDir/dashboard/controllers/common')(module);
              require('moduleDir/dashboard/controllers/dashboard')(module);

              deferred.resolve();
            }, 'dashboard');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/common')(module);
              require('moduleDir/dashboard/controllers/reminders')(module);
              deferred.resolve();
            }, 'reminders');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/common')(module);
              require('moduleDir/dashboard/controllers/members')(module);

              deferred.resolve();
            }, 'members');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/common')(module);
              require('moduleDir/dashboard/controllers/ecards')(module);

              deferred.resolve();
            }, 'ecards');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/common')(module);
              require('moduleDir/dashboard/controllers/history')(module);

              deferred.resolve();
            }, 'history');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/common')(module);
              require('moduleDir/dashboard/controllers/account')(module);

              deferred.resolve();
            }, 'account');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/common')(module);
              require('moduleDir/dashboard/controllers/billing')(module);

              deferred.resolve();
            }, 'billing');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/admin')(module);

              deferred.resolve();
            }, 'admin_users');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/admin')(module);

              deferred.resolve();
            }, 'admin_plans');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/admin')(module);

              deferred.resolve();
            }, 'admin_ecards');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/admin')(module);

              deferred.resolve();
            }, 'admin_settings');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/admin')(module);

              deferred.resolve();
            }, 'admin_index');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/paypal')(module);

              deferred.resolve();
            }, 'paypal');

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

            require.ensure([], function () {

              /** Controllers */
              require('moduleDir/dashboard/controllers/paypal')(module);

              deferred.resolve();
            }, 'paypal_cancel');

            return deferred.promise;
          }]
        }
      });








    }
  ]);
};
