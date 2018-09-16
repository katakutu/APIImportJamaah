var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    "transaction_code" :    String,
    "username"         :    String,
    "cart"             :    String,
    "status"           :    String,
    "shipping_address" :    String,
    "email"            :    String,
    "phone"            :    String,
    "total_amount"     :    String,
    "created_date"     :    Date
}); 

var Transaction = mongoose.model('tbl_transaction', TransactionSchema);
module.exports = Transaction;
