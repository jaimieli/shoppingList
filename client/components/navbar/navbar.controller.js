'use strict';

angular.module('shoppingListApp')
  .controller('NavbarCtrl', function ($scope, $http, $location, Auth, $stateParams, listData) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },{
      'title': 'My Lists',
      'link': '/dashboard'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    if($stateParams.id) {
      console.log('in list');
      $scope.inList = true;
    } else {
      $scope.inList = false;
    }

    $scope.listId = $stateParams.id;

    // get list data on load
    $scope.listName = listData.getListData().name;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });