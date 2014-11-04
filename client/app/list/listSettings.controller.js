'use strict';

angular.module('shoppingListApp')
  .controller('listSettingsCtrl', function ($scope, listData, $rootScope, $stateParams, $location, $http) {
    var listId = $stateParams.id;
    var listSettingsController = this;
    var updateListData = function(){
      listData.setListData(listId).then(function(){
        $scope.listData = listData.getListData()
        console.log('$scope.listData after update in SETTINGS: ', $scope.listData)
      })
    };
    updateListData();
    this.deleteList = function(){
      console.log('trying to delete: ', listId)
      $http.delete('api/lists/' + listId).success(function(data){
        $location.path('/dashboard')
      })
    }
    this.invite = {
      button: 'Submit',
      email: '',
      sent: false
    }
    this.addUser = function(invite){
      var postObj = {
        email: invite.email,
        listId: listId
      }
      listData.addUser(postObj)
      $rootScope.$on('user not found', function(){
        listSettingsController.userAdded = false;
         invite.message = "Not found. Please try another email.";
         invite.sent = false;
         updateListData();
      })
      $rootScope.$on('user added', function(){
        listSettingsController.userAdded = true;
        invite.message = "Successfully added.";
        invite.sent = true;
        updateListData();
      })
    }
  });
