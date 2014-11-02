'use strict';

angular.module('shoppingListApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth) {
    // currentUser
    $scope.currentUser = Auth.getCurrentUser();

    // on page load, get all the lists
    $http.get('/api/users/me').success(function(data){
      $scope.currentUser = data;
    })
    this.newList = {};
    // add list
    this.addList = function() {
      console.log('trying to add list')
      console.log('this.newList: ', this.newList)
      var listObj = this.newList
      listObj.users = [$scope.currentUser._id];
      listObj.createdAt = new Date();
      listObj.modifiedAt = new Date();
      $http.post('/api/lists', listObj).success(function(data){
        console.log('created list: ', data.list)
        console.log('user after creating list: ', data.user);
        $scope.currentUser = data.user;
      })
      this.newList = {};
    }
  });
