'use strict';

angular.module('shoppingListApp')
  .controller('SettingsCtrl', function ($scope, listData) {
    $scope.message = 'Hello';
    console.log('listData.getListData(): ', listData.getListData())
  });
