var config = require('../config/config')
var passport = require('passport')
var facebook_strategy = require('passport-facebook')

exports.facebookLogin = function( product_id, quantity, rupiah) {
	return new Promise(function(resolve,reject){
        
        let query = {
            _id : product_id 
        }
        let data = {
            rupiah : rupiah,
            quantity : quantity
        }

        // resolve(product_model.update(query, data))
        //alternative
        product_model.update(query, data)
        .then(function(update_result){
            resolve(update_result)
        })

		setTimeout(function(){
			reject("WS Call Timeout");
		}, config.ws_timeout);
	});
}