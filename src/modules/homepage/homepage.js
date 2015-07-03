'use strict';

/**
 * Homepage module
 * @desc:
 */
var appDashboard = angular.module('app.homepage', []);

/** routes configs */
require('moduleDir/homepage/configs/routes')(appDashboard);