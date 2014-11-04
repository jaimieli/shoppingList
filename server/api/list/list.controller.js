'use strict';

var _ = require('lodash');
var List = require('./list.model');
var Item = require('../item/item.model')
var User = require('../user/user.model')
var async = require('async')

// Add User to List
exports.addUser = function(req, res){
  console.log('req.body: ', req.body)
  var resultsObj = {};
  var userId;

  // find User and add List
  var addList = function(done){
    User.where({email: req.body.email}).findOne(function(err, user){
      if(err) {
        console.log(err);
        return handleError(res, err);
      }
      if(!user) { return res.send(404, 'cannot find user with the provided e-mail address');}
      if (user.lists){
        user.lists.addToSet(req.body.listId);
      } else {
        var arr = [];
        arr.push(req.body.listId);
        user.lists = arr;
      }
      console.log('user after adding list: ', user);
      userId = user._id.toString();
      user.save(function(err, user){
        if (err){
          console.log(err)
          return handleError(res, err);
        }
        resultsObj.user = user;
        console.log('user after save: ', user)
        done(null, 'done adding list to user document')
      });
    })
  }

  // find List and add User
  var addUser = function(done){
    List.findById(req.body.listId, function(err, list){
      console.log('in add user function')
      if(err) {
        console.log(err);
        return handleError(res, err);
      }
      if(!list) { return res.send(404, 'cannot find list with the provided listId'); }
      list.users.addToSet(userId);
      list.save(function(err, list){
        if (err){
          console.log(err)
          return handleError(res, err);
        }
        resultsObj.list = list;
        done(null, 'done adding user to list')
      });
    })
  }

  // done with async series
  var doneTasks = function(err, results){
    return res.json(200, resultsObj);
  }

  async.series([addList, addUser], doneTasks)

}


// Get list of lists
exports.index = function(req, res) {
  List.find(function (err, lists) {
    if(err) { return handleError(res, err); }
    return res.json(200, lists);
  });
};

// Get a single list
exports.show = function(req, res) {
  List.findOne({_id: req.params.id})
    .populate('users')
    .populate('items')
    .exec(function(err, results) {
      if (err) {
        console.log(err)
        return res.json(500)
      }
      var options = {
        path: 'items.requestedBy',
        model: 'User'
      };
      List.populate(results, options, function(error, items){
          res.send(items)
      })
  })
};

// Creates a new list in the DB.
exports.create = function(req, res) {
  List.create(req.body, function(err, list) {
    var obj = {};
    if(err) {
      console.log(err);
      return handleError(res, err);
    }
    // add list to user doc
    obj.list = list;
    req.user.lists.addToSet(list._id)
    req.user.save(function(err, user){
      if (err) {
        console.log(err);
        return handleError(res, err)
      }
      // upon saving populate list before sending the object back
      user.populate('lists', function(err, user){
        obj.user = user;
        return res.json(201, obj)
      })
    })
  });
};

// Updates an existing list in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }
    var updated = _.merge(list, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, list);
    });
  });
};

// Deletes a list from the DB.
exports.destroy = function(req, res) {
  // Remove items with this listId
  Item.find({listId: req.params.id}, function(err, items){
    var itemsLen = items.length;
    for (var i = 0; i < itemsLen; i++){
      items[i].remove(function(err){
        if (err){
          console.log(err);
          return handleError(res, err)
        } else {
          console.log('removed item successfully!')
        }
      })
    }
  })
  // Remove list document with this _id
  // and remove this list from user's list array
  List.findById(req.params.id, function (err, list) {
    if(err) { return handleError(res, err); }
    if(!list) { return res.send(404); }
    // remove list from user's lists array
    var user = req.user;
    var len = user.lists.length;
    for (var i = 0; i < len; i++){
      if(user.lists[i].toString() === list._id.toString()){
        user.lists.splice(i, 1);
        break;
      }
    }
    user.save(function(err, user){
      if (err){
        console.log(err);
        return handleError(res, err)
      }
    })
    // remove list document
    list.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}