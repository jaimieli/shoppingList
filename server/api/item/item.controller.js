'use strict';

var _ = require('lodash');
var async = require('async');
var request = require('request');
var Item = require('./item.model');
var List = require('../list/list.model')

// Get list of items
exports.index = function(req, res) {
  Item.find(function (err, items) {
    if(err) { return handleError(res, err); }
    return res.json(200, items);
  });
};

// Get a single item
exports.show = function(req, res) {
  Item.findById(req.params.id, function (err, item) {
    if(err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    return res.json(item);
  });
};

// Creates a new item in the DB.
exports.create = function(req, res) {
  var item = req.body;
  var results = {};

  var getPriceData = function(done){
    var options = {
     uri: 'http://item­-price.herokuapp.com/get_price',
     qs: {
       item: item.name
     },
     method: 'GET',
     headers: {
       "Host":"item-price.herokuapp.com",
     },
     json: true
    };
    request(options, function(err, response, body){
      if (err) {
        console.log(err);
        return handleError(res, err)
      }
      item.price = body.price.toFixed(2);
      done(null, 'done getting price data')
    })
  }

  var createItem = function(done) {
    Item.create(item, function(err, item) {
      if(err) {
        console.log(err);
        return handleError(res, err)
      }
      // add item to list doc
      List.findById({_id: item.listId}, function(err, list){
        if (err) {
          console.log(err);
          return handleError(res, err)
        }
        list.items.addToSet(item._id.toString());
        list.total = (list.total + item.price).toFixed(2);
        list.save(function(err, list){
          if (err) {
            console.log(err);
            return handleError(res, err)
          }
          list.populate('items', function(err, list){
            results.list = list;
            done(null, "done creating item");
          })
        })
      })
    });
  }

  var doneTasks = function(err){
    if(err)console.log(err);
    return res.json(201, results)
  }

  async.series([getPriceData, createItem], doneTasks)

};

// Updates an existing item in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Item.findById(req.params.id, function (err, item) {
    if (err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    var updated = _.merge(item, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, item);
    });
  });
};

// Deletes a item from the DB.
exports.destroy = function(req, res) {
  Item.findById(req.params.id, function (err, item) {
    if(err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    List.findById({_id: item.listId}, function(err, list){
      if (err) {
        console.log(err);
        return handleError(res, err)
      }
      // remove item from list's item array
      var len = list.items.length;
      for (var i = 0; i < len; i++){
        if(list.items[i].toString() === item._id.toString()){
          list.items.splice(i, 1);
          break;
        }
      }
      // update list total
      list.total = (list.total - item.price).toFixed(2);
      list.save(function(err, list){
        if (err) {
          console.log(err);
          return handleError(res, err)
        }
      })
    })
    item.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}