var db = require('../config/database.js');

exports.getMerchant = function (merchant_id) {
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT * FROM tbl_merchant WHERE merchant_id = ?', [merchant_id], function (err, rows) {
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
