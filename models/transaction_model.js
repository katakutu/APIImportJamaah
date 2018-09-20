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

exports.retrieve = function(transaction_id){
    let query = {_id : transaction_id}
    return transaction_collection.findOne(query).exec()
}

exports.retrieveList = function(query){
    delete query.requestID
    return transaction_collection.find(query).exec()
}