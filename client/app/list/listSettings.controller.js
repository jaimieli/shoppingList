'use strict';

angular.module('shoppingListApp')
  .controller('listSettingsCtrl', function ($scope, listData, $rootScope, $stateParams, $location, $http) {
    var listId = $stateParams.id;
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
        console.log('successfully deleted list')
        $location.path('/dashboard')
      })
    }
  });
