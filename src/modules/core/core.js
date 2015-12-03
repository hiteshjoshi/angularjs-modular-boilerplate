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
require('moduleDir/core/configs/run')(appCore);
require('moduleDir/core/configs/routes')(appCore);

/** controllers */
require('moduleDir/core/controllers/appsetting')(appCore);

/** directives */
require('moduleDir/core/directives/indicator/indicator')(appCore);
require('moduleDir/core/directives/slider/slider')(appCore);
require('moduleDir/core/directives/datetimepicker/datetimepicker')(appCore);

/** filters */
require('moduleDir/core/filters/capitalize')(appCore);

/** factories */
require('moduleDir/core/services/viewport')(appCore);
require('moduleDir/core/services/restful')(appCore);
require('moduleDir/core/services/sessionCheck')(appCore);
