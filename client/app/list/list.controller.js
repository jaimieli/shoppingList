'use strict';

angular.module('shoppingListApp')
  .controller('ListCtrl', function ($scope, listData, $stateParams, Auth, $http) {
    $scope.message = 'Hello';
    var listId = $stateParams.id;
    this.remainingCosts = 0;
    this.dollarsSpent = 0;
    var updateListData = function(){
      listData.setListData(listId).then(function(){
        $scope.listData = listData.getListData()
        console.log('$scope.listData after update: ', $scope.listData)
        this.remainingCosts = listData.getRemainingCosts();
        console.log('this')
        this.dollarsSpent = listData.getDollarsSpent();
      })
    };
    updateListData();
    this.newItem = {};
    this.addItem = function(item){
      if(item.tags){
        item.tags = item.tags.split('/');
      }
      item.listId = listId;
      item.requestedBy = Auth.getCurrentUser()._id;
      $http.post('/api/items', item).success(function(data){
        $scope.listData = data.list;
        console.log('$scope.listData after adding item: ', $scope.listData)
      })
      this.newItem = {};
    }
    this.deleteItem = function(item){
      $http.delete('/api/items/' + item._id).success(function(d){
        updateListData();
      })
    }
    this.updateStatus = function(item){
      console.log('update purchase status of: ', item)
      $http.put('/api/items/' + item._id, item).success(function(){
        updateListData();
      })
    }
  });
