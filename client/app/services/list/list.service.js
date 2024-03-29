'use strict';

angular.module('shoppingListApp')
  .factory('listData', function ($http, $rootScope) {
    var listData = {};
    var remainingCosts = 0;
    var dollarsSpent = 0;
    return {
      setListData: function(id) {
        var self = this;
        return $http.get('/api/lists/' + id).success(function(data){
          listData = data;
          dollarsSpent = 0;
          remainingCosts = 0;
          if (listData){
            if(listData.items) {
              var len = listData.items.length;
              for (var i = 0; i < len; i++){
                if(listData.items[i].purchased){
                  dollarsSpent += listData.items[i].price;
                } else {
                  remainingCosts += listData.items[i].price
                }
              }
            }
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
      addUser: function(obj){
        return $http.post('/api/lists/addUser', obj)
          .success(function(data){
            $rootScope.$emit('user added')
          })
          .error(function(data){
            $rootScope.$emit('user not found')
          })
      }
    };
  });
