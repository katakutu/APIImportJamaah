var db = require('../config/database.js');

exports.addTrx = function(data, done) {
    var trx_data = {
        'reference_number' : data.reference_number,
        'billing_code' : data.billing_code,
        'merchant_id' : data.merchant_id,
        'amount' : data.amount,
        'redirect_page' : data.redirect_page,
        'status' : data.status,
        'transaction_key' : data.transaction_key,
        'merchant_reference_number' : data.merchant_reference_number,
        'status' : data.status,
        'status_desc' : data.status_desc
    };

    db.get().query('INSERT INTO tbl_transaction SET ?', [trx_data], function(err, result) {
        if (err){
            console.log(err); 
            return done(err)
        }
        done(null, result.insertId) 
    })
}

exports.updateInquiryData = function (inquiry_mpn_data, reference_number, done) {
    db.get().query('UPDATE tbl_transaction SET inquiry_mpn_data = ? WHERE reference_number = ?', [inquiry_mpn_data, reference_number + ""], function (err, rows) {
        if (err) {
            return done(err);
        }
        done(null, "");
    });
};

exports.updateStatusTransaction = function (status, status_desc, reference_number, done) {
    db.get().query('UPDATE tbl_transaction SET status = ?, status_desc = ? WHERE reference_number = ?', [status, status_desc, reference_number + ""], function (err, rows) {
        if (err) {
            return done(err);
        }
        done(null, "");
    });
};

exports.updatePaymentDataEpay = function (epay_reference_number, reference_number, done) {
    db.get().query(
        'UPDATE tbl_transaction SET date_payment_epay = NOW(), epay_reference_number = ? WHERE reference_number = ?',
        [epay_reference_number, reference_number + "", ],
        function (err, rows) { 
            if (err) {
                return done(err);
            }
            done(null, "");
       }
    );
};

exports.updatePaymentDataMPN = function (payment_mpn_data, reference_number, done) {
    db.get().query(
        'UPDATE tbl_transaction SET date_payment_MPN = NOW(), payment_mpn_data = ? WHERE reference_number = ?',
        [payment_mpn_data, reference_number + ""],
        function (err, rows) {
            if (err) {
                return done(err);
            }
            done(null, "");
       }
    );
};

exports.updatePaymentDataMPN = function (payment_mpn_data, reference_number, done) {
    db.get().query(
        'UPDATE tbl_transaction SET date_payment_MPN = NOW(), payment_mpn_data = ? WHERE reference_number = ?',
        [payment_mpn_data, reference_number + ""],
        function (err, rows) {
            if (err) {
                return done(err);
            }
            done(null, "");
       }
    );
};

exports.updateDataFlaggingMerchant = function (reference_number, done) {
    db.get().query(
        'UPDATE tbl_transaction SET date_flagging_merchant = NOW() WHERE reference_number = ?',
        [reference_number + ""],
        function (err, rows) {
            if (err) {
                return done(err);
            }
            done(null, "");
       }
    );
};

exports.getTrxByMerchantReff = function (merchant_id, merchant_reference_number) {
    console.log(merchant_id)
    console.log(merchant_reference_number)
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT * FROM tbl_transaction WHERE merchant_id = ? AND merchant_reference_number = ?', [merchant_id, merchant_reference_number], function (err, rows) {
            if(err){
                console.log(err);
                reject(err);
            } 
            else 
            {
                resolve(rows);
            }
        });
    })
};

exports.getTrx = function (reference_number) {
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT * FROM tbl_transaction WHERE reference_number = ?', [reference_number], function (err, rows) {
            if(err){
                console.log(err);
                reject(err);
            } 
            else 
            {
                resolve(rows);
            }
        });
    })
};

exports.getTrxByTransactionKey = function (transaction_key) {
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT * FROM tbl_transaction WHERE transaction_key = ?', [transaction_key], function (err, rows) {
            if(err){
                console.log(err);
                reject(err);
            }
            else 
            {
                resolve(rows);
            }
        });
    })
};

