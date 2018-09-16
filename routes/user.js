var express = require('express');
var routes = express.Router();

//load controller
var register = require('../controllers/user/register');
var retrieve = require('../controllers/user/retrieve');

//load routes
routes.post('/register', function(req, res, next) {
	register.register(req, res);
});

//load routes
routes.post('/retrieve', function(req, res, next) {
	retrieve.retrieve(req, res);
});

module.exports = routes;
