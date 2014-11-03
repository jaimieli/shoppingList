'use strict';

angular.module('shoppingListApp')
  .factory('listData', function ($http) {
    var listData = {};
    var remainingCosts = 0;
    var dollarsSpent = 0;
    var modifiedDate;
    return {
      setListData: function(id) {
        var self = this;
        return $http.get('/api/lists/' + id).success(function(data){
          listData = data;
          dollarsSpent = 0;
          remainingCosts = 0;
          if (listData && listData.items.length){
            var len = listData.items.length;
            for (var i = 0; i < len; i++){
              if(listData.items[i].purchased){
                dollarsSpent += listData.items[i].price;
              } else {
                remainingCosts += listData.items[i].price
              }
            }
            // var month = listData.modifiedAt.getMonth() + 1;
            // var day = listData.modifiedAt.getDate();
            // var year = listData.modifiedAt.getFullYear();
            // modifiedDate = month + '/' + day + '/' + year;

          }
        });
      },
      getListData: function(){
        return listData;
      },
      getRemainingCosts: function(){
        return remainingCosts.toFixed(2);
      },
      getDollarsSpent: function(){
        return dollarsSpent.toFixed(2);
      },
      getModifiedDate: function(){
        return modifiedDate;
      }
    };
  });
