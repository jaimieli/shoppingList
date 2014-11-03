'use strict';

angular.module('shoppingListApp')
  .factory('listData', function ($http) {
    var listData = {};
    var remainingCosts = 0;
    var dollarsSpent = 0;
    return {
      setListData: function(id) {
        var self = this;
        return $http.get('/api/lists/' + id).success(function(data){
          listData = data;
          var len = listData.items.length;
          for (var i = 0; i < len; i++){
            if(listData.items[i].purchased){
              dollarsSpent += listData.items[i].price;
            } else {
              remainingCosts += listData.items[i].price
            }
          }
          console.log('dollarsSpent: ', dollarsSpent)
          console.log('remainingCosts: ', remainingCosts)
        });
      },
      getListData: function(){
        return listData;
      },
      getRemainingCosts: function(){
        return remainingCosts;
      },
      getDollarsSpent: function(){
        return dollarsSpent;
      }
    };
  });
