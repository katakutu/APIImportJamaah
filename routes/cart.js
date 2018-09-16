var express = require('express');
var routes = express.Router();

//load controller
var addToCart = require('../controllers/cart/addToCart');

//load routes
routes.post('/add', function(req, res, next) {
	addToCart.add(req, res);
});

module.exports = routes;
