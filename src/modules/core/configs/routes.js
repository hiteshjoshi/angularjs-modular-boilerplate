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
      
      /** default route */
      $urlRouterProvider.otherwise('/');

      /** parent route */
      $stateProvider.state('dashboard', {
        abstract: true,
        url: '',
        templateUrl: 'modules/core/views/layouts/dashboard.html'
      })
      .state('homepage', {
        abstract: true,
        url: '',
        templateUrl: 'modules/core/views/layouts/homepage.html'
      });
    }
  ]);
};