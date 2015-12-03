'use strict';

/**
 * Core setting controller
 * @module: app.core 
 */
module.exports = function (module) {
  module.controller('coreSettingsCtrl', [
    '$rootScope',
    '$scope',
    '$window',
    '$timeout',
    '$cookies',
    'viewport',
    '$state',
    'session',
    '$urlRouter', 
    '$modal',
    function ($rootScope,$scope, $window, $timeout, $cookies, viewport,$state,session,$urlRouter,$modal) {
      $rootScope.quickDemo = function (index) {
          $modal.open({
          templateUrl: 'modules/homepage/views/quickDemo-popup.html'
        });
      };
      /** App Initial Settings */
      $scope.core = {
        name: 'CareToCall',
        version: '0.0.1',
        settings: {
          fullScreen: false,
          pageLoading: false,
          headerFixed: true,
          headerSearchForm: false,
          sidebarLeftOpen: false,
          sidebarLeftFixed: false,
          sidebarLeftCollapse: viewport.width() >= 768 && viewport.width() < 992 ? true : false
        },
        screen: {
          xs: viewport.width() < 768 ? true : false,
          sm: viewport.width() >= 768 && viewport.width() < 992 ? true : false,
          md: viewport.width() >= 992 && viewport.width() < 1200 ? true : false,
          lg: viewport.width() >= 1200 ? true : false,
          height: viewport.height(),
          width: viewport.width()
        }
      };

      /** hide sidebar and show loading indicator */
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //console.log(toState.name, fromState.name);
        // if(toState.name === fromState.name){
        //   console.log('HELP');
        //   return true;
        // }

        // $rootScope.title = 'Loading...';
        
        // var allowedState = session.allowedState;

        // if(session.exists() === false){

        //   if((allowedState.indexOf(toState.name) > -1)){//current state is allowed to be used;

        //   }
        //   else{
        //     event.preventDefault();
        //     $urlRouter.sync();
            
        //     $timeout(function(){
        //       console.log(session.state,1);
        //       $state.transitionTo(session.state,{},{
        //         reload: true, inherit: false, notify: true
        //       });

        //     });
        //   }  
          
        // }
        // else{ // if session exists, dont let them go to allowed state
        //   if((allowedState.indexOf(toState.name) > -1) && (toState.name !== fromState.name) ){//current state is allowed to be used;
        //     event.preventDefault();
        //     $urlRouter.sync();
            
        //     $timeout(function(){
        //       console.log(session.state,2);
        //       $state.transitionTo(session.state,{},{
        //         reload: true, inherit: false, notify: true
        //       });

        //     });
        //   }
        // }

        $scope.core.settings.sidebarLeftOpen = false;
        $scope.core.settings.pageLoading = true;
      });

      /** show loading indicator */
      $rootScope.$on('$stateChangeSuccess', function (event, current, previous) {
        $scope.core.settings.pageLoading = false;
        $rootScope.title = current.title;
      });


      /** On resize, update viewport variable */
      angular.element($window).on('resize', function () {
        $timeout.cancel($scope.resizing);

        $scope.resizing = $timeout(function () {
          $scope.core.screen.xs = viewport.width() < 768 ? true : false;
          $scope.core.screen.sm = viewport.width() >= 768 && viewport.width() < 992 ? true : false;
          $scope.core.screen.md = viewport.width() >= 992 && viewport.width() < 1200 ? true : false;
          $scope.core.screen.lg = viewport.width() >= 1200 ? true : false;
          $scope.core.screen.height = viewport.height();
          $scope.core.screen.width = viewport.width();
        }, 100);
      });
    }
  ]);
};