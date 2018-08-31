//init configuration
var config = require('../../config/config');

//init library
var exception_handler = require('../../libraries/exception_handler');
var validator = require('../../libraries/form_validation/mpn_validation');
var indicative = require('indicative')
var inArray = require('in-array');

//init helper
var mpn_transaction_helper = require('../../libraries/mpn_transaction_helper');
var merchant_transaction_helper = require('../../libraries/merchant_transaction_helper');
var pg_transaction_helper = require('../../libraries/pg_transaction_helper');

//init model
var result = require('../../models/objectResponse');
var responseLog = require('../../models/responselog');
var tbl_transaction = require('../../models/tbl_transaction');
var tbl_rrn = require('../../models/tbl_rrn');
var tbl_merchant = require('../../models/tbl_merchant');


exports.updateTransactionStatus = function(req, res) {
    //init param
    var flag_new_spec = false
    var flag_reversal = false
    var param_bill_reference_no = ''
    var param_merchant_id = ''
    var param_merchant_url = ''
    var param_data_transaction = ''
    var param_status = config.param.status.transaction_success

    //init respond variable
    var param_decode = {}
    var response_code = ""
    var response_desc = ""
    var response_data = {}
    var reference_number = ''
    var transaction_status = ''
    var transaction_status_desc = ''
    var data_mpn = ''

    //flag to differ between old spec (GET method) and new spec (POST method)
    if(req.method == "POST")
        flag_new_spec = true

    //parameter to be sent to Payment Gateway and MPN Service
    if(flag_new_spec == true){
        param_decode = req.body
        param_merchant_id = param_decode.merchant_id;
        param_bill_reference_no = param_decode.bill_reference_no;
        param_bank_reference_number = param_decode.bank_reference_no;
        param_transaction_date = param_decode.transaction_date;
        param_user_fullname = param_decode.user_fullname;
        param_status = param_decode.status;
    } else { 
        param_decode = req.query
        param_merchant_id = param_decode.payeeId;
        param_bill_reference_no = param_decode.billReferenceNo;
        param_bank_reference_number = param_decode.paymentRefNo;
        param_transaction_date = param_decode.transactionTime;
        param_user_fullname = param_decode.userFullName;
        param_status = param_decode.status;
    }

    //define action for validation purpose
    var action = req.originalUrl
    var rules = validator.rules(action); 
    
	//parameter validation, if valid then check merchant wether member of the aggregator's or not
	indicative.validate(param_decode, rules, '').then(function () {
        console.log("===================== DEBET CREDIT RESULT ==================")
        console.log(param_decode)

        //set transaction status / step
        transaction_status = param_status == config.param.status.transaction_success ? config.param.transaction_step.code.success_epay : config.param.transaction_step.code.fail_epay
        transaction_status_desc = param_status == config.param.status.transaction_success ? config.param.transaction_step.desc.success_epay : config.param.transaction_step.desc.fail_epay

        //update date payment epay
        tbl_transaction.updatePaymentDataEpay(param_bank_reference_number, param_bill_reference_no, function(err, done) {
            if (err) console.log(err);
        });

        return tbl_merchant.getMerchant(param_merchant_id)
    }) 
    //merchant data then passed to variable 'merchant'
    .then(function(merchant){
        //if no response from database, return DF
		if(!merchant)
		{
             //update status
            tbl_transaction.updateStatusTransaction(transaction_status, transaction_status_desc, param_bill_reference_no, function(err, done) {
                if (err) console.log(err);
            });

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
                 //update status
                tbl_transaction.updateStatusTransaction(transaction_status, transaction_status_desc, param_bill_reference_no, function(err, done) {
                    if (err) console.log(err);
                });

                result.responseCode = "MN";
                result.responseID = req.requestID;
                result.responseDesc = 'Merchant not exist';
                result.responseData = "";
                throw result;
            }
            //else if merchant exist, then retrieve data transaction in DB aggregator by reference_number 
            else 
            {
                param_merchant_url = merchant[0].merchant_url
                return tbl_transaction.getTrx(param_bill_reference_no);
            }
        } 
    })
    //data transaction then passed to variable 'data_transaction'
	.then(function(data_transaction) {
		//if no response from database, return TF
		if(!data_transaction)
		{
            //update status
            tbl_transaction.updateStatusTransaction(transaction_status, transaction_status_desc, param_bill_reference_no, function(err, done) {
                if (err) console.log(err);
            });

			result.responseCode = "TF";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to retrieve data transaction';
			result.responseData = "";
			throw result;
        }
        //if data_transaction retrieved
        else 
        { 
            //if transaction not exist, then return 'TN'
            if(data_transaction.length <= 0 ){
                //update status
                tbl_transaction.updateStatusTransaction(transaction_status, transaction_status_desc, param_bill_reference_no, function(err, done) {
                    if (err) console.log(err);
                });

                result.responseCode = "TN";
                result.responseID = req.requestID;
                result.responseDesc = 'Transaction not exist';
                result.responseData = "";
                throw result;
            }
            //else if data transaction exist, then flagging activity to MPN
            else 
            {
                param_data_transaction = data_transaction[0]
                //if debet credit in PG fail (F), then return EM, skip flagging to MPN
                if(param_status == config.param.status.transaction_fail){
                    //do nothing 
                    var mpn_no_flag = {
                        MpnData : {
                            P39 : 'EM',
                            ErrorMessage : 'Skip flagging to MPN'
                        }
                    }
                    return mpn_no_flag
                }
                //if debet credit in PG success (S), then do flagging to MPN
                else 
                {
                    /** --------------------------- HARDCODE -----------------------------------------
                    var mpn_hardcode_success = {
                        MpnData : {
                            P39 : '00',
                            ErrorMessage : 'Success Flagging to MPN'
                        }
                    }

                    return mpn_hardcode_success;
                    ---------------------------------------------------------------------------------*/
                    return mpn_transaction_helper.flaggingRequest(param_bill_reference_no, param_data_transaction.inquiry_mpn_data)
                }
            }
        }
    })
    //response JSON from MPN service then passed to variable 'respondWS'
    .then(function(respondWS){
        console.log("===================== FLAGGING API MPN RESULT ==================")
        console.log(respondWS)

        //if no response from MPN Service, then return QM
        if(!respondWS){
            //set transaction status / step
            transaction_status = config.param.transaction_step.code.fail_mpn
            transaction_status_desc = config.param.transaction_step.desc.fail_mpn

            //update status timeout to service mpn
            tbl_transaction.updateStatusTransaction(transaction_status, transaction_status_desc, param_bill_reference_no, function(err, done) {
                if (err) console.log(err);
            });

            result.responseCode = "QM";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to call service MPN';
			result.responseData = "";
			throw result;
        } 
        //if response from MPN Service exist
        else 
        {
            data_mpn = respondWS.MpnData

            //compose response message
            response_code = data_mpn.P39
            response_desc = data_mpn.ErrorMessage
            
            //if response code not equals '00'
            if(response_code != "00"){
                 //set transaction status / step
                 transaction_status = config.param.transaction_step.code.fail_mpn
                 transaction_status_desc = config.param.transaction_step.desc.fail_mpn

                 //handling reversal, only for rc (88,27,02)
                if(inArray(config.param.mpn.rc_reversal, response_code) ){
                    flag_reversal = true
                    param_status = config.param.status.transaction_fail

                    pg_transaction_helper.reversalTransaction(param_bill_reference_no,param_data_transaction.merchant_id, param_data_transaction.transaction_key)
                } 
            } 
             //if response code equals '00', then store transaction_status and transaction_status_desc with step MPN
            else 
            {
                //set transaction status / step
                transaction_status = config.param.transaction_step.code.success_mpn
                transaction_status_desc = config.param.transaction_step.desc.success_mpn
            }

             //update data payment MPN
             tbl_transaction.updatePaymentDataMPN(JSON.stringify(data_mpn), param_bill_reference_no, function(err, done) {
                if (err) console.log(err);
            });

            //do flagging to merchant
            return merchant_transaction_helper.flaggingRequest(
                param_data_transaction.billing_code,
                param_merchant_id,
                param_data_transaction.amount,
                param_data_transaction.reference_number,
                data_mpn.KodeNTB,
                data_mpn.KodeNTPN,
                param_status,
                param_data_transaction.merchant_reference_number,
                param_merchant_url 
            )
        }
    })
     //response JSON from MERCHANT service then passed to variable 'respondWS'
    .then(function(respondWS){
        console.log("===================== FLAGGING MERCHANT RESULT ==================")
        console.log(respondWS)

        //if no response from MERCHANT Service, then return QP
        if(!respondWS){
            //set transaction status / step
            transaction_status = config.param.transaction_step.code.fail_merchant
            transaction_status_desc = config.param.transaction_step.desc.fail_merchant

            //update status timeout to service mpn
            tbl_transaction.updateStatusTransaction(transaction_status, transaction_status_desc, param_bill_reference_no, function(err, done) {
                if (err) console.log(err);
            });

            result.responseCode = "QP";
			result.responseID = req.requestID;
			result.responseDesc = 'fail to call service  MERCHANT';
			result.responseData = "";
			throw result;
        } 
        //if exist response from MERCHANT Service, then send back SUCCESS or REVERSAL message to client
        else 
        {
            //set transaction status / step
            transaction_status = config.param.transaction_step.code.success_merchant
            transaction_status_desc = config.param.transaction_step.desc.success_merchant

            //update data flagging Merchant
            tbl_transaction.updateDataFlaggingMerchant(param_bill_reference_no, function(err, done) {
                if (err) console.log(err);
            });

            tbl_transaction.updateStatusTransaction(transaction_status, transaction_status_desc, param_bill_reference_no, function(err, done) {
                if (err) console.log(err);
            });

            if(flag_reversal == true){
                //updateTransactionStatus REVERSED
                result.responseCode = "RV";
                result.responseID = req.requestID;
                result.responseDesc = response_desc;
                result.responseData = config.param.status.transaction_fail;		
                throw result;
            } else {
                result.responseCode = "00";
                result.responseID = req.requestID;
                result.responseDesc = respondWS.responseDesc;
                result.responseData = config.param.status.transaction_success;		
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