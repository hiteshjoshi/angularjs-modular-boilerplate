'use strict';

/**
 * App module
 * @desc: Main application setup
 */
var app = angular.module('app', [
  /** core modules */
  'app.core',

  /** others modules */
  'app.homepage',
  'app.dashboard',
]);

/**
 * load up our modules
 */
require('moduleDir/core/core');
require('moduleDir/dashboard/dashboard');
require('moduleDir/homepage/homepage');

/**
 * bootstrap our App
 */
angular.element(document).ready(function () {
  angular.bootstrap(document, ['app']);
});