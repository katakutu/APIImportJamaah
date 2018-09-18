var express = require('express');
var routes = express.Router();

//load controller
var createTransaction = require('../controllers/transaction/create');
var retrieveTransaction = require('../controllers/transaction/retrieve');

//load routes
routes.post('/create', function(req, res, next) {
	createTransaction.create(req, res);
});
routes.post('/retrieve', function(req, res, next) {
	retrieveTransaction.retrieve(req, res);
});

module.exports = routes;
