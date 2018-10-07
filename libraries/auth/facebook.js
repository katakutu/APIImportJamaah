var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../../config/config');
var user = require('../../collections/tbl_user');

passport.use(
    new FacebookStrategy({
        clientID: config.facebook.client_id,
        clientSecret: config.facebook.client_secret,
        callbackURL: "https://localhost:4009/authentication/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        //console.log(accessToken, refreshToken, profile)
       done(null, profile)
    }
));

module.exports = passport;