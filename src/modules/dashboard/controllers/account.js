'use strict';

/**
 * Activities feed controller
 * @module: app.account
 * @desc: Show some activity feed
 */
module.exports = function (module) {
  module.controller('accountCtrl', ['$scope', 'api','lodash', function ($scope, api,lodash) {

    $scope.updateUser = {};
    $scope.alerts = [];

  	api.get('ping',false,false,false,function (err,response){
  		if(err){

  		}
  			$scope.plan = response.data.plan;
        $scope.profile = response.data.plan.user_id;
        $scope.updateUser = {
          'first_name':$scope.profile.firstName,
          'last_name':$scope.profile.lastName,
          'landline':$scope.profile.landline,
          'mobile':$scope.profile.mobile,
          'preferred_number':$scope.profile.preferred_number,
          'address_1':$scope.profile.billing_details.address_1,
          'address_2':$scope.profile.billing_details.address_2,
          'city':$scope.profile.billing_details.city,
          'state':$scope.profile.billing_details.state,
          'postal':$scope.profile.billing_details.postal,
          'country_code':$scope.profile.billing_details.country_code,
          'timezone':$scope.profile.billing_details.timezone
        };
  	});

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

  	$scope.updateAccount = function () {
  		api.put('users',$scope.user._id,false,$scope.updateUser,function (err,response) {
        if(err){

        }
        else{
          
          if(response.error){
            lodash.forEach(response.errors,function(item){
              $scope.alerts.push({type:'error',msg:item.msg});
            });
          }
          else
          {
            $scope.alerts = [];
            $scope.alerts.push({type:'info',msg:'Profile updated.'}); 
          }
        }
  		});
  	};


  }]);
};
