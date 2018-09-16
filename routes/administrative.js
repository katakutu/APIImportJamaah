var express = require('express');
var routes = express.Router();

//load controller
var retrieve = require('../controllers/administrative/retrieve');

//load routes
routes.post('/retrieve', function(req, res, next) {
	retrieve.retrieve(req, res);
});

module.exports = routes;
