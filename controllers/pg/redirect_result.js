//init configuration
var config = require('../../config/config');

//init library
var exception_handler = require('../../libraries/exception_handler');
var validator = require('../../libraries/form_validation/pg_validation');
var indicative = require('indicative')
 
//init model
var result = require('../../models/objectResponse');
var responseLog = require('../../models/responselog');
var tbl_transaction = require('../../models/tbl_transaction');

exports.redirectResult = function(req, res) {
    //init param
    var param_keys_trxecomm = ''

    //init respond variable
    var param_decode = {}
    var response_code = "00";
    var response_desc = "SUCCESS retrieve redirect data";
    var payment_mpn_data = {}
    var response_data = {};

    //parameter to be sent to be queried in aggregator's database 
    param_decode = req.body
    param_keys_trxecomm = param_decode.keys_trxecomm;

    //define action for validation purpose
    var action = req.originalUrl
    var rules = validator.rules(action); 
    
	//parameter validation, if valid then retrieve data transaction
	indicative.validate(param_decode, rules, '').then(function () {
        return tbl_transaction.getTrxByTransactionKey(param_keys_trxecomm)
    })
    //data transaction from database then passed to variable 'data_transaction'
	.then(function(data_transaction) {
		//if no response from database, return TF
		if(!data_transaction)
		{
			result.responseCode = "TF";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to retrieve data transaction';
			result.responseData = "";
			throw result;
        }
        //if data transaction retrieved, compose response message 
        else 
        { 
            //if transaction not exist, then return 'TN'
            if(data_transaction.length <= 0 ){
                result.responseCode = "TN";
                result.responseID = req.requestID;
                result.responseDesc = 'Transaction not exist';
                result.responseData = "";
                throw result;
            }
            //else if data transaction exist, then compose message 
            else 
            {
                payment_mpn_data = JSON.parse(data_transaction[0].payment_mpn_data)
                response_code = payment_mpn_data.P39 
                response_desc = payment_mpn_data.ErrorMessage

                response_data = {
                    redirect_page : data_transaction[0].redirect_page,
                    merchant_id : data_transaction[0].merchant_id,
                    billing_code : data_transaction[0].billing_code,
                    merchant_reference_no : data_transaction[0].merchant_reference_number,
                }

                result.responseCode = response_code;
                result.responseID = req.requestID;
                result.responseDesc = response_desc;
                result.responseData = response_data;		
                responseLog.saveResponse(result);
                res.send(result)
            }
        }
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};