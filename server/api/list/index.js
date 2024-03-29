'use strict';

var express = require('express');
var controller = require('./list.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/addUser', controller.addUser)
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;