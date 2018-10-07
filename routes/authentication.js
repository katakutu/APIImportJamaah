var express = require('express');
var routes = express.Router();
var passportFacebook = require('../libraries/auth//facebook');

//load controller
var login = require('../controllers/authentication/login');
var facebookLogin = require('../controllers/authentication/facebookLogin');

let crot = ''

//load routes
routes.post('/login', function(req, res, next) {
	login.login(req, res);
});

routes.get('/facebook', passportFacebook.authenticate('facebook', {scope:"email"}));

routes.get(
	'/facebook/callback',
	passportFacebook.authenticate('facebook'),
	(req,res) => {
		res.send("TAIIIKKK")
		res.redirect('/profile')
	}
)

module.exports = routes;
