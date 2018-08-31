var config = require('../config/config');
var rp = require('request-promise');

/*
* method untuk melakukan insert payment parameter ke epay.
*/
exports.insertPaymentParameter = function (billing_code, merchant_id, amount, redirect_page, keys_trxecomm)
{
    var url_ws = config.url_ws_pg.insert_payment + "?payeeId=" + merchant_id + "&billReferenceNo=" + billing_code + "&keysTrxEcomm=" + keys_trxecomm
    parameter = {
        method: 'GET',
        uri: url_ws,
        timeout : config.ws_timeout 
    };
    return rp(parameter);
}

/*
* method untuk melakukarn request reversal transaction ke epay
*/
exports.reversalTransaction = function (billing_code, merchant_id, keys_trxecomm)
{   
    var url_ws = config.url_ws_pg.reversal_payment + "?payeeId=" + merchant_id + "&billReferenceNo=" + billing_code + "&keysTrxEcomm=" + keys_trxecomm
    parameter = {
        method: 'GET',
        uri: url_ws,
        timeout : config.ws_timeout 
    };
    
    return rp(parameter);
}

/*
* method untuk melakukarn request reversal transaction ke epay
*/
exports.statusTransaction = function (billing_code, merchant_id, keys_trxecomm)
{   
    var url_ws = config.url_ws_pg.status_enquiry + "?payeeId=" + merchant_id + "&billReferenceNo=" + billing_code + "&keysTrxEcomm=" + keys_trxecomm
    console.log(url_ws)
    parameter = {
        method: 'GET',
        uri: url_ws,
        timeout : config.ws_timeout 
    };
    
    return rp(parameter);
}