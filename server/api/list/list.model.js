'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListSchema = new Schema({
  name: String,
  description: String,
  active: Boolean,
  users: [ { type: Schema.Types.ObjectId, ref:'User'} ],
  items: [ { type: Schema.Types.ObjectId, ref:'Item'} ],
  total: { type: Number, default: null}
});

module.exports = mongoose.model('List', ListSchema);