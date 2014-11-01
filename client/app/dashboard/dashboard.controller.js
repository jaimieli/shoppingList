'use strict';

angular.module('shoppingListApp')
  .controller('DashboardCtrl', function ($scope, $http, socket, Auth) {
    // currentUser
    $scope.currentUser = Auth.getCurrentUser();

    // on page load, get all the lists
    $http.get('/api/users/me').success(function(data){
      $scope.currentUser = data;
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
        console.log('created list: ', data.list)
        console.log('user after creating list: ', data.user);
        $scope.currentUser = data.user;
      })
      this.newList = '';
    }
  });
