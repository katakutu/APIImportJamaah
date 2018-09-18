//init configuration
var config = require('../../config/config');

//init library
var exception_handler = require('../../libraries/exception_handler');
var validator = require('../../libraries/form_validation/transaction_validation');

var indicative = require('indicative')

//init helper

//init model
var transaction_model = require('../../models/transaction_model');

var result = require('../../models/objectResponse');
var responseLog = require('../../models/responselog');

exports.retrieve = function(req, res) {
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
        return transaction_model.retrieve(param_decode.transaction_id)
    })
    .then(function(transaction){
        result.responseCode = "00";
        result.responseID = req.requestID;
        result.responseDesc = "retrieve data transaksi berhasil";
        result.responseData = transaction;		
        responseLog.saveResponse(result);
        res.send(result);
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};