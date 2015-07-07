'use strict';

/**
 * Dashboard module
 * @desc:
 */
var appDashboard = angular.module('app.admin', []);

/** routes configs */
require('moduleDir/admin_dashboard/configs/routes')(appDashboard);