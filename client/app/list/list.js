'use strict';

angular.module('shoppingListApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('list', {
        url: '/list',
        templateUrl: 'app/list/list.html',
        controller: 'ListCtrl'
      });
  });