'use strict';

angular.module('shoppingListApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth) {
    // currentUser
    $scope.currentUser = Auth.getCurrentUser();

    // on page load, get all the lists
    $scope.lists = [];

    $http.get('/api/users/me').success(function(data){
      $scope.currentUser = data;
      socket.syncUpdates('user', $scope.currentUser)
    })

    // add list
    this.addList = function() {
      console.log('trying to add list')
      console.log('this.newList: ', this.newList)
      var listName = this.newList;
      var listObj = {
        name: listName,
        users: [$scope.currentUser._id]
      }
      $http.post('/api/lists', listObj).success(function(data){
        console.log('data after creating list: ', data)
      })
      this.newList = '';
    }
  });
