//init configuration
var config = require('../../config/config')

//init library
var exception_handler = require('../../libraries/exception_handler')
var validator = require('../../libraries/form_validation/product_validation')
var dateformat = require('dateformat')

var indicative = require('indicative')

//init helper

//init model
var product_model = require('../../models/product_model')

var result = require('../../models/objectResponse')
var responseLog = require('../../models/responselog')

exports.retrieve = function(req, res) {
    var param_decode = req.body;

    //parameter to be processed
    var param_result = {}
    
    //define action for validation purpose
    var action = req.originalUrl
    var rules = validator.rules(action); 

    //init respond variable
    var response_code = "";
    var response_data = {};
    var reference_number = '';

    var product_id = ''
    
	//parameter validation, if valid then check merchant wether member of the aggregator's or not
	indicative.validate(param_decode, rules, '').then(function () {
        return product_model.retrieve(param_decode)
    })
    .then(function(product){
        if(!product){
            result.responseCode = "PX";
            result.responseID = req.requestID;
            result.responseDesc = "Product tidak ditemukan";
            result.responseData = "";		
            responseLog.saveResponse(result);
            res.send(result);
        } else {
            result.responseCode = "00";
            result.responseID = req.requestID;
            result.responseDesc = "retrieve product berhasil";
            result.responseData = product;		
            responseLog.saveResponse(result);
            res.send(result);
        }
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};