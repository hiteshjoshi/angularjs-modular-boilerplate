'use strict';

/**
 * admin routes
 * @module: app.admin
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
      $stateProvider.state('admin.index', {
        url: '/',
        templateUrl: 'modules/admin_dashboard/views/admin.html',
        resolve: {
          load: ['$q', '$rootScope', function ($q, $rootScope) {
            var deferred = $q.defer();

            require.ensure([], function () {
              /** Controllers */
              require('moduleDir/admin_dashboard/controllers/activities-feed')(module);

              deferred.resolve();
            }, 'admin');

            return deferred.promise;
          }]
        }
      });

      $stateProvider.state('admin.settings', {
        url: '/settings',
        templateUrl: 'modules/admin_dashboard/views/settings.html',
        resolve: {
          load: ['$q', '$rootScope', function ($q, $rootScope) {
            var deferred = $q.defer();

            require.ensure([], function () {
              /** Controllers */
              

              deferred.resolve();
            }, 'settings');

            return deferred.promise;
          }]
        }
      });
      
      $stateProvider.state('admin.users', {
        url: '/users',
        templateUrl: 'modules/admin_dashboard/views/users.html',
        resolve: {
          load: ['$q', '$rootScope', function ($q, $rootScope) {
            var deferred = $q.defer();

            require.ensure([], function () {
              /** Controllers */
              

              deferred.resolve();
            }, 'users');

            return deferred.promise;
          }]
        }
      });

      $stateProvider.state('admin.plans', {
        url: '/plans',
        templateUrl: 'modules/admin_dashboard/views/plans.html',
        resolve: {
          load: ['$q', '$rootScope', function ($q, $rootScope) {
            var deferred = $q.defer();

            require.ensure([], function () {
              /** Controllers */
              require('moduleDir/admin_dashboard/controllers/plans')(module);
              

              deferred.resolve();
            }, 'plans');

            return deferred.promise;
          }]
        }
      });

      $stateProvider.state('admin.ecards', {
        url: '/ecards',
        templateUrl: 'modules/admin_dashboard/views/ecards.html',
        resolve: {
          load: ['$q', '$rootScope', function ($q, $rootScope) {
            var deferred = $q.defer();

            require.ensure([], function () {
              /** Controllers */
              

              deferred.resolve();
            }, 'ecards');

            return deferred.promise;
          }]
        }
      });






    }
  ]);
};