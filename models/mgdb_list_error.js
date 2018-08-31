var listError = require('../collections/list_error');
var config = require('../config/config');
var inArray = require('in-array');

exports.saveErrorCode = function (data) {
    var errorCode = new listError({
        rc : data.rc,
        action : data.action,
        trx_type_id : data.trx_type_id,
        trx_category : data.trx_category,
        trx_group_id : data.trx_group_id,
        title_id : data.title_id,
        title_en : data.title_en
    });

    //Save ListError to mongoDB
    errorCode.save(function (err, logs) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log("berhasil")
        }
    });
}

exports.retrieveAll = function(query, done){
    listError.find(query, function(err, errorObj){
        if(err) { 
            return done(err);
        } else {
            done(null, errorObj);
        }
    }) ;   
}

exports.retrieve = function(errors, param_decode, done){
    var query = {};
    var trx_type_id;
    var action = "General";
    var trx_category = "General";

    var rc_by_category = [
        'General',
        'Bancassurance',
        'PaymentAngsuran',
        'PaymentGateway'
	]

    if (inArray(rc_by_category, trx_category)) {
        query = {rc : errors.responseCode, trx_category : trx_category}; 
    }

    listError.findOne(query, function(err, errorObj){
        if(err) { 
            return done(err);
        } else {
            done(null, errorObj);
        }
    }) ;   
}