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
