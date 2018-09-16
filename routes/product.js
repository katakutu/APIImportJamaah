var express = require('express');
var routes = express.Router();

//load controller
var retrieveProduct = require('../controllers/product/retrieve');

//load routes
routes.post('/retrieve', function(req, res, next) {
	retrieveProduct.retrieve(req, res);
});

module.exports = routes;
