var config = require('../config/config');
var jwt = require('jsonwebtoken');
var dateformat = require('dateformat')
var sha256 = require("crypto-js/sha256")

exports.generateToken = function(username, password) {
	return new Promise(function(resolve,reject){
        let session_id = ''
        let token_id = ''
        let token_exp = ''
        let data_raw = ''

        session_id = sha256(username.toUpperCase()+password);
        session_id = session_id.toString().substring(1,40);

        data_raw = {
            username: username
        }
        
        token_exp = Math.floor(Date.now() / 1000) + (60 * 60);
        token_id = jwt.sign({
            exp: token_exp,
            data: data_raw,
            algorithm: 'RS256'
        },username.toUpperCase()+config.secret)
        token_exp = 1000 * (60 * 60)

        token_data = {
            token_id : token_id,
            token_exp : token_exp
        }
        
        resolve(token_data)

		setTimeout(function(){
			reject("WS Call Timeout");
		}, config.ws_timeout);
	});
};