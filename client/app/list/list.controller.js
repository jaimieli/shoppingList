'use strict';

angular.module('shoppingListApp')
  .controller('ListCtrl', function ($scope, listData, $stateParams, Auth, $http) {
    $scope.message = 'Hello';
    var listId = $stateParams.id;
    this.remainingCosts = 0;
    this.dollarsSpent = 0;
    var listController = this;
    var updateListData = function(){
      listData.setListData(listId).then(function(){
        $scope.listData = listData.getListData()
        console.log('$scope.listData after update: ', $scope.listData)
        listController.remainingCosts = listData.getRemainingCosts();
        listController.dollarsSpent = listData.getDollarsSpent();
      })
    };
    updateListData();
    this.newItem = {};
    this.addItem = function(item){
      if(item.tags){
        item.tags = item.tags.replace(/\s*,\s*/g, ',').split(',');
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
    $scope.tagFilter = function(input) {
      console.log('tag filter')
      console.log('$scope.tagsModel: ', $scope.tagsModel)
        if ($scope.tagsModel) {
          console.log('in tag filter')
          return $scope.tagsModel.replace(/\s*,\s*/g, ',').split(',').every(function(tag) {
            return input.tags.some(function(objTag){
              return objTag.indexOf(tag) !== -1;
            });
          });
        }
        else {
          return true;
        }
      };
  });
