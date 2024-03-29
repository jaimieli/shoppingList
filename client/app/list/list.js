'use strict';

angular.module('shoppingListApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('list', {
        url: '/list/:id',
        templateUrl: 'app/list/list.html',
        controller: 'ListCtrl',
        controllerAs: 'List'
      })
      .state('listSettings', {
        url: '/list/:id/settings',
        templateUrl: 'app/list/listSettings.html',
        controller: 'listSettingsCtrl',
        controllerAs: 'ListSettings'
      });
});