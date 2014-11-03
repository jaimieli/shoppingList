'use strict';

angular.module('shoppingListApp')
  .controller('listSettingsCtrl', function ($scope, listData, $rootScope, $stateParams) {
    var listId = $stateParams.id;
    var updateListData = function(){
      listData.setListData(listId).then(function(){
        $scope.listData = listData.getListData()
        console.log('$scope.listData after update in SETTINGS: ', $scope.listData)
      })
    };
    updateListData();
  });
