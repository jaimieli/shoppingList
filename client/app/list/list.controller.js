'use strict';

angular.module('shoppingListApp')
  .controller('ListCtrl', function ($scope, listData, $stateParams, Auth, $http) {
    $scope.message = 'Hello';
    var listId = $stateParams.id;
    listData.setListData(listId).then(function(){
      $scope.listData = listData.getListData()
      console.log('$scope.listData in list: ', $scope.listData)
    })
    this.newItem = {};
    this.addItem = function(item){
      item.tags = item.tags.split('/');
      item.listId = listId;
      item.requestedBy = Auth.getCurrentUser()._id;
      $http.post('/api/items', item).success(function(data){
        $scope.listData = data.list;
        console.log('$scope.listData after adding item: ', $scope.listData)
      })
      this.newItem = {};
    }
  });
