//init configuration
var config = require('../../config/config');

//init library
var exception_handler = require('../../libraries/exception_handler');
var validator = require('../../libraries/form_validation/pg_validation');
var xmlreader = require('xmlreader')
var indicative = require('indicative')

//init helper
var pg_transaction_helper = require('../../libraries/pg_transaction_helper');

//init model
var result = require('../../models/objectResponse');
var responseLog = require('../../models/responselog');
var tbl_transaction = require('../../models/tbl_transaction');
var tbl_rrn = require('../../models/tbl_rrn');
var tbl_merchant = require('../../models/tbl_merchant');


exports.queryStatusTransaction = function(req, res) {
    //init param
    var param_bill_reference_no = ''
    var param_merchant_id = ''
    var param_data_transaction = ''

    //init respond variable
    var param_decode = {}
    var response_code = ""
    var response_desc = ""
    var response_data = {}
    var data_mpn = ''
    var data_pg = ''

    //parameter to be sent to Payment Gateway
    param_decode = req.body
    param_merchant_id = param_decode.merchant_id;
    param_billing_code = param_decode.billing_code;
    param_merchant_reference_no = param_decode.merchant_reference_no
    
    //define action for validation purpose
    var action = req.originalUrl
    var rules = validator.rules(action); 
    
	//parameter validation, if valid then check merchant wether member of the aggregator's or not
	indicative.validate(param_decode, rules, '').then(function () {
        return tbl_merchant.getMerchant(param_merchant_id)
    }) 
    //merchant data then passed to variable 'merchant'
    .then(function(merchant){
        //if no response from database, return DF
		if(!merchant)
		{
			result.responseCode = "DF";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to retrieve merchant';
			result.responseData = "";
			throw result;
        }
        else 
        {
            //if merchant not exist, then return 'MN'
            if(merchant.length <= 0 ){
                result.responseCode = "MN";
                result.responseID = req.requestID;
                result.responseDesc = 'Merchant not exist';
                result.responseData = "";
                throw result;
            }
            //else if merchant exist, then retrieve data transaction in DB aggregator by reference_number 
            else 
            {
                return tbl_transaction.getTrxByMerchantReff(param_merchant_id, param_merchant_reference_no);
            }
        } 
    })
    //data transaction then passed to variable 'data_transaction'
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
        //if data transaction retrieved 
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
            //else if data transaction exist, then call status transaction to PG 
            else 
            {
                param_data_transaction = data_transaction[0]
                return pg_transaction_helper.statusTransaction(param_data_transaction.reference_number, param_merchant_id, param_data_transaction.transaction_key)
            }
        }
    })
    //response XML from PG service then passed to variable 'respondWS'
    .then(function(respondWS){
        //if no response from PG Service, then return QC
        if(!respondWS){
            result.responseCode = "QC";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to call service PG';
			result.responseData = "";
			throw result;
        } else {
            return new Promise(function(resolve,reject){
                //convert PG Service response (EnquiryStatus) XML into JSON format
                xmlreader.read(respondWS, function(err, response){
                    if (err){
                        reject("fail to convert data : " + err);
                    } else {
                        var respond = {};
                        if(response.pg.status.text() == "D"){
                            respond = {
                                action : response.pg.action.text(),
                                payeeId : response.pg.payeeId.text(),
                                status : response.pg.status.text(),
                                respond : response.pg.respond.text(),
                                respondDescription : response.pg.respondDescription.text()
                            }
                        } else {
                            respond = { 
                                action : response.pg.action.text(),
                                payeeId : response.pg.payeeId.text(),
                                payementRefNo : response.pg.payementRefNo.text(),
                                transactionDate : response.pg.transactionDate.text(),
                                transactionTime : response.pg.transactionTime.text(),
                                userFullName : response.pg.userFullName.text(),
                                status : response.pg.status.text(),
                                respond : response.pg.respond.text(),
                                respondDescription : response.pg.respondDescription.text()
                            }
                        }
                        
                        resolve(respond);
                    }
                }) 
    
                setTimeout(function(){
                    reject("Parsing Timeout");
                }, config.ws_timeout)
            })
        }
    })
    //result parsing XML to JSON pass to variable 'respondParse'
    .then(function(respondParse){
        //if parsing fail, then return PF
        if(!respondParse){
            result.responseCode = "PF";
			result.responseID = req.requestID;
			result.responseDesc =  'fail parsing XML to JSON';
			result.responseData = "";
			throw result;
        } 
        //if parsing success, then compose response message then send back to client
        else 
        {
            respondParse.merchant_reference_no = param_merchant_reference_no

            result.responseCode = "00";
            result.responseID = req.requestID;
            result.responseDesc = "Check Status Berhasil"
            result.responseData = respondParse		
            responseLog.saveResponse(result);
            res.send(result)
        }
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};