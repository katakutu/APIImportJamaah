var express = require('express');
var routes = express.Router();

//load controller
var login = require('../controllers/authentication/login');

//load routes
routes.post('/login', function(req, res, next) {
	login.login(req, res);
});

module.exports = routes;
