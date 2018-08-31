var config = require('../config/config');
var rp = require('request-promise');
var dateformat = require('dateformat')

exports.flaggingRequest = function(
    param_billing_code,
    param_merchant_id,
    param_amount,
    param_reference_number,
    param_Ntb,
    param_Ntpn,
    param_status,
    param_merchant_reference_number,
    param_merchant_url
) {
    var param_headers = {"Content-type": "application/json"}
    var param_req_obj = {
        billing_code : param_billing_code,
        merchant_id : param_merchant_id,
        amount : param_amount,
        reference_number : param_reference_number,
        Ntb : param_Ntb,
        Ntpn : param_Ntpn,
        transaction_date : param_transaction_date,
        status : param_status,
        merchant_reference_number : param_merchant_reference_number,
    }
    /*
    parameter = {
        method: 'POST',
        uri: param_merchant_url,
        form: JSON.stringify(param_req_obj),
        headers : param_headers,
        timeout : config.ws_timeout 
    };*/
    //return rp(parameter);

    var result = {}
    return new Promise(function(resolve,reject){
        result.responseCode = "00";
        result.responseDesc = 'Sukses Flagging';
        result.responseData = "";
        resolve(result)
    });
};