//init configuration
var config = require('../../config/config');

//init library
var exception_handler = require('../../libraries/exception_handler');
var validator = require('../../libraries/form_validation/mpn_validation');
var indicative = require('indicative')
var js2xmlparser = require("js2xmlparser")

//init helper
var mpn_transaction_helper = require('../../libraries/mpn_transaction_helper');

//init model
var result = require('../../models/objectResponse');
var responseLog = require('../../models/responselog');
var tbl_transaction = require('../../models/tbl_transaction');
var tbl_rrn = require('../../models/tbl_rrn');
var tbl_merchant = require('../../models/tbl_merchant');


exports.inquiryOrderRequest = function(req, res) {
    //init param
    var flag_new_spec = false
    var param_bill_reference_no = ''
    var param_merchant_id = ''
    var param_reference_number = ''
    var param_data_transaction = ''

    //init respond variable
    var param_decode = {}
    var response_code = "";
    var response_desc = "";
    var response_data = {};
    var reference_number = '';

    //flag to differ between old spec (GET method) and new spec (POST method)
    if(req.method == "POST")
        flag_new_spec = true

    //parameter to be sent to Payment Gateway
    if(flag_new_spec == true){
        param_decode = req.body
        param_bill_reference_no = param_decode.bill_reference_no;
        param_merchant_id = param_decode.merchant_id;
    } else { 
        param_decode = req.query
        param_bill_reference_no = param_decode.billReferenceNo;
        param_merchant_id = param_decode.payeeId;
    }

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
                param_reference_number = param_bill_reference_no
                return tbl_transaction.getTrx(param_reference_number);
            }
        } 
    })
    //data transaction then passed to variable 'rrn'
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
        //if rrn retrieved, create key trx ecommerce using
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
            //else if data transaction exist, then use data_transaction.billing_code to inq to service MPN 
            else 
            {
                param_data_transaction = data_transaction[0]
                param_bill_reference_no = param_data_transaction.billing_code
                return mpn_transaction_helper.inquiryOrderRequest(param_bill_reference_no)
            }
        }
    })
    //response JSON from MPN service then passed to variable 'respondWS'
    .then(function(respondWS){
        //if no response from MPN Service, then return QM
        if(!respondWS){
            result.responseCode = "QM";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to call service MPN';
			result.responseData = "";
			throw result;
        } 
        //if response from MPN Service exist then, compose return message  
        else 
        {
            //compose response message for client (epay)
            response_data = {
                action : 'Query Order Request',
                payeeId : config.param.pg.merchant_id,
                billAccountNo : param_bill_reference_no,
                billReferenceNo : param_reference_number,
                amount : respondWS.MpnData.TransJumlah,
                items : {}
            }

            //compose response message
            response_code = respondWS.MpnData.P39
            response_desc = respondWS.MpnData.ErrorMessage

            console.log(respondWS.MpnData)

            //if RC equals "00" and input amount vs amount from service MPN not equals 
            if(response_code == config.response_code.success && param_data_transaction.amount != respondWS.MpnData.TransJumlah){
                result.responseCode = "AF";
                result.responseID = req.requestID;
                result.responseDesc = 'Amount from inquiry result not match with data in database MA';
                result.responseData = "";
                throw result;
            }
            
            //update inquiry mpn data in tbl_transaction
            tbl_transaction.updateInquiryData(JSON.stringify(respondWS.MpnData), param_reference_number,  function(err, done) {
                if (err) console.log(err);
            });
            
            //if response code equals '00' then compose items element
            if(response_code == "00"){
                response_data.items.item = {
                    name : respondWS.MpnData.NamaWP,
                    price : respondWS.MpnData.TransJumlah,
                    quantity : 1
                }
            } else {
                response_data = null;
            }

            if(flag_new_spec == true)
                return response_data
            else
                return js2xmlparser.parse('pg', response_data)
        }
        
    })
    //XML result of MPN Service response (inquiryOrderRequest) then passed to variable 'xml_result'
    .then(function(mpn_result){
        //if XML-JSON conversion fail
        if(!mpn_result){
            result.responseCode = "ER";
            result.responseID = req.requestID;
            result.responseDesc = 'Failed to convert JSON respond to XML ';
            result.responseData = "";
            throw result;
        }
        //else if XML-JSON conversion success 
        else 
        {
            //inquiryOrderRequest SUCCESS
            result.responseCode = response_code;
            result.responseID = req.requestID;
            result.responseDesc = response_desc;
            result.responseData = response_data;		
            responseLog.saveResponse(result);

            if(flag_new_spec == true)
                res.send(result)
            else
                res.send(mpn_result);
        }
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};