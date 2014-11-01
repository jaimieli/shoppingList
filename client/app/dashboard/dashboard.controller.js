'use strict';

angular.module('shoppingListApp')
  .controller('DashboardCtrl', function ($scope, $http) {
    this.addList = function() {
      console.log('trying to add list')
      console.log('this.newList: ', this.newList)
      var listName = this.newList;
      $http.post('/api/lists', {name: listName}).success(function(data){
        console.log('data after creating list: ', data)
      })
      this.newList = '';
    }
  });
