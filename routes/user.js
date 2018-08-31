var express = require('express');
var routes = express.Router();

//load controller
var register = require('../controllers/user/register');

//load routes
routes.post('/register', function(req, res, next) {
	register.register(req, res);
});

module.exports = routes;
