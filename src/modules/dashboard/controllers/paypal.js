'use strict';

/**
 * Activities feed controller
 * @module: app.account
 * @desc: Show some activity feed
 */
module.exports = function (module) {
  module.controller('paypalCtrl', ['$scope', 'api','$location', function ($scope, api,$location) {
    $scope.alerts = [];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  api.get('/paypal','payments',false,{token:$location.search().token},function (err,response) {
    if(err){
      $scope.paypal = 'Some error! Please close this window and try again.';
    }
    else{
      $scope.paypal = response.userMessage;
    }
  });

  //window.opener.$scope.says = 'teapot';
  //window.value = true;

  }]);
};
