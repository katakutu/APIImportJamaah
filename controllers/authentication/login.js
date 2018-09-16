//init configuration
var config = require('../../config/config');

//init library
var exception_handler = require('../../libraries/exception_handler');
var validator = require('../../libraries/form_validation/authentication_validation');
var dateformat = require('dateformat')
var token_lib = require("../../libraries/token_library")

var indicative = require('indicative')

//init helper

//init model
var user_model = require('../../models/user_model');

var result = require('../../models/objectResponse');
var responseLog = require('../../models/responselog');

exports.login = function(req, res) {
    var param_decode = req.body;

    //parameter to be processed
    var param_username = param_decode.username;
    var param_password = param_decode.password; 
    var param_result = {}
    
    //define action for validation purpose
    var action = req.originalUrl
    var rules = validator.rules(action); 

    //init respond variable
    var response_code = "";
    var response_data = {};
    var reference_number = '';

    var password_stored = ''
    var session_id = ''
    var token_exp = ''
    var token_id = ''
    var user_data = ''
    
	//parameter validation, if valid then check merchant wether member of the aggregator's or not
	indicative.validate(param_decode, rules, '').then(function () {
        return user_model.retrieve(param_username)
    })
    .then(function(user){
        if(!user){
            result.responseCode = "UN";
            result.responseID = req.requestID;
            result.responseDesc = "User tidak ditemukan";
            result.responseData = "";		
            responseLog.saveResponse(result);
            res.send(result);
        } else {
            password_stored = user.password
            if(param_password == password_stored){
                user_data = {
                    username : user.username,
                    email : user.email,
                    phone : user.phone
                }
                return token_lib.generateToken(param_username, param_password);
            } else {
                result.responseCode = "P2";
                result.responseID = req.requestID;
                result.responseDesc = "Password Salah";
                result.responseData = "";		
                responseLog.saveResponse(result);
                res.send(result);
            }
        }
    })
    .then(function(token){
        
        response_data = user_data
        response_data.token_id = token.token_id
        response_data.token_expiration = token.token_exp

        result.responseCode = "00";
        result.responseID = req.requestID;
        result.responseDesc = "login user berhasil";
        result.responseData = response_data;		
        responseLog.saveResponse(result);
        res.send(result);
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};