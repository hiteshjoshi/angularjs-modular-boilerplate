'use strict';

/**
 * Core module
 * @desc:
 */
var appCore = angular.module('app.core', [
  'ngCookies',
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap',
  'ui.router',
  'ui.jq'
]);

/** routes and run configs */
require('moduleDir/core/configs/run')(appCore);
require('moduleDir/core/configs/routes')(appCore);

/** controllers */
require('moduleDir/core/controllers/appsetting')(appCore);

/** directives */
require('moduleDir/core/directives/indicator/indicator')(appCore);

/** filters */
require('moduleDir/core/filters/capitalize')(appCore);

/** factories */
require('moduleDir/core/services/viewport')(appCore);