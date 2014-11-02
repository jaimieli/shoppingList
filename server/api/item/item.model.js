'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: String,
  active: Boolean,
  listId: { type: Schema.Types.ObjectId, ref:'List' },
  price: { type: Number, default: null },
  purchased: { type: Boolean, default: false },
  requestedBy: { type: Schema.Types.ObjectId, ref:'User'},
  assignedTo: { type: Schema.Types.ObjectId, ref:'User'},
  tags: [ String ],
  notes: String
});

module.exports = mongoose.model('Item', ItemSchema);