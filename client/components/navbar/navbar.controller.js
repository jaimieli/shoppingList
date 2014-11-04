'use strict';

angular.module('shoppingListApp')
  .controller('NavbarCtrl', function ($scope, $http, $location, Auth, $stateParams, listData, $rootScope) {
    $scope.menu = [{
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
    var updateListData = function(){
      listData.setListData($scope.listId).then(function(){
        $scope.listName = listData.getListData().name
      })
    };

    if ($scope.inList) {
      updateListData();
    }

    $rootScope.$on('new listData', function(event, data){
      console.log('catching new listData in navbar')
      $scope.listName = data.name;
    })
    // $scope.listName = listData.getListData().name;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });