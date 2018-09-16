var express = require('express');
var routes = express.Router();

//load controller
var createTransaction = require('../controllers/transaction/create');

//load routes
routes.post('/create', function(req, res, next) {
	createTransaction.create(req, res);
});

module.exports = routes;
