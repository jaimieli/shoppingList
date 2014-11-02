'use strict';

angular.module('shoppingListApp')
  .factory('listData', function ($http) {
    var listData = {};
    return {
      setListData: function(id) {
        var self = this;
        return $http.get('/api/lists/' + id).success(function(data){
          listData = data;
        });
      },
      getListData: function(){
        return listData;
      }
    };
  });
