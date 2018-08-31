//init configuration
var config = require('../../config/config');

//init library
var exception_handler = require('../../libraries/exception_handler');
var validator = require('../../libraries/form_validation/pg_validation');
var xmlreader = require('xmlreader')
var encrypt = require("crypto-js/sha256")
var indicative = require('indicative')

//init helper
var pg_transaction_helper = require('../../libraries/pg_transaction_helper');
var mpn_transaction_helper = require('../../libraries/mpn_transaction_helper');

//init model
var result = require('../../models/objectResponse');
var responseLog = require('../../models/responselog');
var tbl_transaction = require('../../models/tbl_transaction');
var tbl_rrn = require('../../models/tbl_rrn');
var tbl_merchant = require('../../models/tbl_merchant');


exports.insertPaymentParameter = function(req, res) {
    var param_decode = req.body;

    //parameter to be sent to Payment Gateway
    var param_billing_code = param_decode.billing_code;
    var param_merchant_id = param_decode.merchant_id; 
    var param_amount = param_decode.amount;
    var param_redirect = param_decode.redirect_page
    var param_merchant_reference_no = param_decode.merchant_reference_no
    var param_keys_trxecomm = ''
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
            //else if merchant exist, then retrieve reference number  
            else 
            {
                return tbl_transaction.getTrxByMerchantReff(param_merchant_id, param_merchant_reference_no)
            }
        } 
    })
    .then(function (data_transaction) {
        //if no response from database, return TF
		if(!data_transaction)
		{
			result.responseCode = "DF";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to retrieve data transaction';
			result.responseData = "";
			throw result;
        }
        //if data_transaction retrieved
        else 
        { 
            //if transaction not exist, then return 'TN'
            if(data_transaction.length > 0 ){
                result.responseCode = "TE";
                result.responseID = req.requestID;
                result.responseDesc = 'Transaction already exist, duplicate transaction';
                result.responseData = "";
                throw result;
            }
            //else if data transaction exist, then flagging activity to MPN
            else 
            {
                return tbl_rrn.getRRNPromise();
            }
        }
    })
    //reference number then passed to variable 'rrn'
	.then(function (rrn) {
		//if no response from database, return FR
		if(!rrn)
		{
			result.responseCode = "DF";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to retrieve reference number';
			result.responseData = "";
			throw result;
        }
        //if rrn retrieved, create key trx ecommerce using sha256 encryption then call service PG -> insertPaymentParameter 
        else 
        { 
            reference_number = rrn;
            param_keys_trxecomm = encrypt(param_merchant_id + "" + param_billing_code + "" + reference_number).toString()
            return pg_transaction_helper.insertPaymentParameter(reference_number, param_merchant_id, param_amount, param_redirect, param_keys_trxecomm)
        }
    })
    //response XML from PG service then passed to variable 'respondWS'
    .then(function(respondWS){ 
        if(!respondWS){
            result.responseCode = "QC";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to call service PG';
			result.responseData = "";
			throw result;
        } else {
            return new Promise(function(resolve,reject){
                //convert PG Service response (insertPaymentParameter) XML into JSON format
                xmlreader.read(respondWS, function(err, response){
                    if (err){
                        reject("fail to convert data : " + err);
                    } else {
                        var respond = {
                            action : response.pg.action.text(),
                            respond : response.pg.respond.text(),
                            status : response.pg.status.text(),
                            description : response.pg.description.text() 
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
    //JSON result of PG Service response (insertPaymentParameter) then passed to variable 'json_result'
    .then(function(json_result){
        //if XML-JSON conversion fail
        if(!json_result){
            result.responseCode = "ER";
            result.responseID = req.requestID;
            result.responseDesc = 'Failed to convert XML respond to JSON ';
            result.responseData = "";
            throw result;
        }
        //else if XML-JSON conversion success 
        else 
        {
            //if json_result.respond not equal 00
            if(json_result.respond != "00"){
                result.responseCode = "PF";
                result.responseID = req.requestID;
                result.responseDesc = json_result.description;
                result.responseData = "";
                throw result;
            } 
            //else if json_result.respond  equal 00
            else 
            {
                //compose additional data to param_decode, purpose : insertion to tbl_transaction
                param_decode.reference_number = reference_number
                param_decode.status = 0
                param_decode.transaction_key = param_keys_trxecomm
                param_decode.merchant_reference_number = param_merchant_reference_no
                param_decode.status = config.param.transaction_step.code.init_transaction
                param_decode.status_desc = config.param.transaction_step.desc.init_transaction

                param_result = json_result

                //check billing code in MPN, is available to be paid
                return mpn_transaction_helper.inquiryOrderRequest(param_billing_code)
            } 
        }
    })
    .then(function(respondWS){
        //if no response from MPN Service, then return QM
        if(!respondWS){
            result.responseCode = "QM";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to call service MPN';
			result.responseData = "";
			throw result;
        }
        //if response MPN service exist 
        else 
        {
            //if response code from MPN Service not "00", then return MF
            if(respondWS.MpnData.P39 != "00"){
                result.responseCode = "MF";
                result.responseID = req.requestID;
                result.responseDesc = respondWS.MpnData.ErrorMessage;
                result.responseData = "";
                throw result;
            }
            //if response code equals "00", then send back SUCCESS message 
            else 
            {
                //prepare keys_trxecomm to be returned in response_data parameter
                response_data = {
                    keys_trxecomm : param_keys_trxecomm
                }
    
                console.log(respondWS);
    
                //if transJumlah from MPN service not equals input amount, then return AF
                if(respondWS.MpnData.TransJumlah != param_amount){
                    result.responseCode = "AF";
                    result.responseID = req.requestID;
                    result.responseDesc = "Jumlah bayar tidak sesuai";
                    result.responseData = "";
                    throw result;
                }
    
                //insert data insertPaymentParameter to tbl_transaction
                tbl_transaction.addTrx(param_decode, function(err, done) {
                    if (err) console.log(err);
                });
    
                //insertPaymentParameter SUCCESS
                result.responseCode = param_result.respond;
                result.responseID = req.requestID;
                result.responseDesc = param_result.description;
                result.responseData = response_data;		
                responseLog.saveResponse(result);
                res.send(result);
            }
        }
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};