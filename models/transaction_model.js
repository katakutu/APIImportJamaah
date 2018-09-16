var transaction_collection = require('../collections/tbl_transaction');
var query = null;
var statement = null;
var option = null;

exports.save = function (data) {
    let transaction = new transaction_collection({
        username         :    data.username, 
        cart             :    data.cart, 
        status           :    data.status, 
        shipping_address :    data.shipping_address, 
        email            :    data.email, 
        phone            :    data.phone, 
        total_amount     :    data.total_amount, 
        created_date     :    data.created_date
    });

    //Save transaction to mongoDB
    return transaction.save()
}