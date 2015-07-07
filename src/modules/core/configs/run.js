/**
 * Core run
 * @module: app.core
 */
module.exports = function (module) {
  module.run([
    '$rootScope',
    '$state',
    '$stateParams',
    '$http',
    '$cookies',
    'Permission',
    'session',
    function ($rootScope, $state, $stateParams,$http,$cookies,Permission,session) {

        //Define anonymous role
        Permission.defineRole('anonymous', function (stateParams) {
            // If the returned value is *truthy* then the user has the role, otherwise they don't
            return !session.exists();
        });
        
        //Define admin role
        Permission.defineRole('admin', function (stateParams) {
            return session.is_admin;
        });
        
        //Define user role
        Permission.defineRole('user', function (stateParams) {
            return session.exists();
        });
        
        //For tokens and other requests.
        $http.defaults.headers.common.Authorization = 'Bearer '+$cookies.c2cCookie;
        //$http.defaults.withCredentials = true;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.title = 'We care';
    }
  ]);
};