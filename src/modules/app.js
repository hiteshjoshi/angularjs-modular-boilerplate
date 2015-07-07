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
require('moduleDir/core/core');
require('moduleDir/dashboard/dashboard');
require('moduleDir/homepage/homepage');

/**
 * bootstrap our App
 */
angular.element(document).ready(function () {
  angular.bootstrap(document, ['app']);
});
