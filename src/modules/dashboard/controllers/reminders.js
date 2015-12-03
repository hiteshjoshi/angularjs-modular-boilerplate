'use strict';

/**
 * Activities feed controller
 * @module: app.account
 * @desc: Show some activity feed
 */
module.exports = function (module) {
  module.controller('remindersCtrl', ['$scope', 'api','moment','$modal','lodash', function ($scope, api,moment,$modal,_) {
    $scope.alerts = [];
    $scope.reminders = [];
    $scope.show_form = false;
    $scope.edit_form = false;




    $scope.newReminder = {
      schedule_date : new Date(),
      recipients: [],
      title : '',
      notify_by_email : true,
      notify_by_text : true,
      notify_by_voice : true,
      text_sms : '',
      email : '',
      number_voice_recording: '',
      recurring:false,
      recurring_frequency:1
    };
    $scope.members = [];
    api.get('users',$scope.user._id,'networks',false,function (err,response){
        if(err){

        }
        else{
          $scope.members = response.data.members;
        }
      });

  $scope.loadReceipts = function (query) {
    console.log('Load loadReceipts');
    return $scope.members;
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.disable_voice = true;
  $scope.disable_text = true;
  $scope.disable_email = true;

  $scope.$watch('newReminder.notify_by_voice',function (newValue) {
    $scope.disable_voice = !newValue;
    if(!$scope.$$phase){
      $scope.$apply();
    }
  });

  $scope.$watch('newReminder.notify_by_text',function (newValue) {
    $scope.disable_text = !newValue;
    if(!$scope.$$phase){
      $scope.$apply();
    }
  });
  $scope.$watch('newReminder.notify_by_email',function (newValue) {
    $scope.disable_email = !newValue;
    if(!$scope.$$phase){
      $scope.$apply();
    }
  });


  $scope.datetimepickerConfig = {
    onSelectDate : function (ct,$i) {
      $scope.newReminder.schedule_date = ct;
      if(!$scope.$$phase){
        $scope.$apply();
      }
    },
    onSelectTime : function (ct,$i) {
      $scope.newReminder.schedule_date = ct;
      if(!$scope.$$phase){
        $scope.$apply();
      }
    }
  };

    api.get('reminders',false,false,false,function (err,response){
      if(err){

      }
      if(response.data.reminders && response.data.reminders.length>0) {
        $scope.reminders = response.data.reminders;
        $scope.network = response.data.network;
      }
      else{
        if(response.data.network.length<1){
          $scope.alerts.push({type:'info',msg:'You need to add friends/family to your network before you can add reminders.'});
        }
        $scope.show_form = false;
      }
    });

    $scope.addReminder = function () {
      api.post('reminders',false,$scope.newReminder,function (err,response){
        if(err){

        }else{
          if(response.error){
            $scope.alerts = [];
            _.forEach(response.errors,function(item){
              $scope.alerts.push({type:'error',msg:item.msg});
            });
          }
          else{
            $scope.reminders.push(response.data.reminder);
            $scope.show_form = false;
          }
        }
      });
    };

    $scope.updateReminder = function (index) {

      api.put('reminders',$scope.reminders[index]._id,false,{},function (err,response){
        if(err){

        }else{
          if(response.error){
            $scope.alerts = [];
            _.forEach(response.errors,function(item){
              $scope.alerts.push({type:'error',msg:item.msg});
            });
          }
        }
      });
    };

    $scope.viewReminder = function (index) {
      var modalInstance = $modal.open({
  			templateUrl: 'modules/dashboard/views/reminder-popup.html',
  			controller: 'viewReminderPopup',
        resolve : {
          reminder : function(){
            return $scope.reminders[index];
          },
          network : function () {
            return $scope.network;
          }
        }
	    });
    };


    $scope.removeReminder = function (index) {
      api.delete('reminders',$scope.reminders[index]._id,false,function (err,response){
        if(err){

        }else{
          if(response.error){
            $scope.alerts = [];
            _.forEach(response.errors,function(item){
              $scope.alerts.push({type:'error',msg:item.msg});
            });
          }
          else
          {
            $scope.reminders.splice(index,1);
          }
        }
      });

    };


  }]);

  module.controller('viewReminderPopup', ['$scope','$modalInstance','api','reminder','network',function ($scope, $modalInstance, api,reminder,network) {

    $scope.reminder = reminder;
    $scope.network = network;

		$scope.ok = function () {
			$modalInstance.close($scope.selected.item);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);
};
