//init configuration
var config = require('../../config/config');

//init library
var exception_handler = require('../../libraries/exception_handler');
var validator = require('../../libraries/form_validation/cart_validation');

var indicative = require('indicative')

//init helper

//init model
var cart_model = require('../../models/cart_model');

var responseLog = require('../../models/responselog');

exports.add = function(req, res) {
    let result = {};
    var param_decode = req.body;
    
    //define action for validation purpose
    var action = req.originalUrl
    var rules = validator.rules(action); 

    //init respond variable
    var response_code = "";
    var response_data = {};
    var reference_number = '';
    
	//parameter validation, if valid then check merchant wether member of the aggregator's or not
	indicative.validate(param_decode, rules, '').then(function () {
        return cart_model.saveCart(param_decode)
    })
    .then(function(cart){
        result.responseCode = "00";
        result.responseID = req.requestID;
        result.responseDesc = "add to cart berhasil";
        result.responseData = cart;		
        responseLog.saveResponse(result);
        res.send(result);
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};