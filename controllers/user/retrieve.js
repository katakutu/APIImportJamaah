//init configuration
var config = require('../../config/config')

//init library
var exception_handler = require('../../libraries/exception_handler')
var validator = require('../../libraries/form_validation/user_validation')
var dateformat = require('dateformat')

var indicative = require('indicative')

//init helper

//init model
var user_model = require('../../models/user_model')

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
    
	//parameter validation, if valid then check merchant wether member of the aggregator's or not
	indicative.validate(param_decode, rules, '').then(function () {
        return user_model.retrieve(param_decode.username)
    })
    .then(function(user){
        if(!user){
            result.responseCode = "UX";
            result.responseID = req.requestID;
            result.responseDesc = "User tidak ditemukan";
            result.responseData = "";		
            responseLog.saveResponse(result);
            res.send(result);
        } else {
            result.responseCode = "00";
            result.responseID = req.requestID;
            result.responseDesc = "retrieve user berhasil";
            result.responseData = user;		
            responseLog.saveResponse(result);
            res.send(result);
        }
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};