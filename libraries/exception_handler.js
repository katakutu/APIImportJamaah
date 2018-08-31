var config = require('../config/config');
var result = require('../models/objectResponse');
var responseLog = require('../models/responselog');
var ListError = require('../models/mgdb_list_error');
var inArray = require('in-array');

var multi_interpret = [
    'Bancassurance',
    'SSB'
]

exports.handlingError = function (req, errors, param_decode, res) {
    var trx_category = "General";


    if(!errors.responseData){
        errors.responseData = "";    
    }

    if(errors[0]){
        if(errors[0].field){
            result.responseCode = config.error_code.validation.rc;
            result.responseID = req.requestID;
            result.responseDesc = config.error_code.validation.desc;
            result.responseData = errors[0];
        } else {
            result.responseCode = config.error_code.general.rc;
            result.responseID = req.requestID;
            result.responseDesc = config.error_code.general.desc;
            result.responseData = errors;
        }
        
        responseLog.saveResponse(result);
        res.send(result);
    }
    //if source errors from 'throw or rejected promise' message, then send back json object without composing
    else if(errors.responseCode)
    {
        ListError.retrieve(errors, param_decode, function(err, errorObj){
            if(err){
                result.responseCode = config.error_code.general.rc;
                result.responseID = req.requestID;
                result.responseDesc = config.error_code.general.desc;
                result.responseData = "";
            } else {
                if(errorObj){
                    result.responseCode = errorObj.rc;
                    result.responseID = req.requestID;
                    if(inArray(multi_interpret, trx_category))
                        result.responseDesc = errors.responseDesc;
                    else
                        result.responseDesc = errorObj.title_id;   
                } else {
                    result.responseCode = errors.responseCode;
                    result.responseID = req.requestID;
                    result.responseDesc = errors.responseDesc;
                }
                result.responseData = errors.responseData;
            }
            responseLog.saveResponse(result);
            res.send(result);
        });
    }
    //else if source errors from validation or exception (too general), then compose send message contain error message
    else
    {
        if(errors.statusCode){
            result.responseCode = errors.statusCode + "";
            result.responseID = req.requestID;
            result.responseDesc = errors.message;
            result.responseData = errors.error;
        }
        else {
            result.responseCode = config.error_code.general.rc;
            result.responseID = req.requestID;
            result.responseDesc = config.error_code.general.desc;
            result.responseData = errors;
        }
        
        responseLog.saveResponse(result);
        res.send(result);
    }
};