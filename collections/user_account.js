var mongoose = require('mongoose');

var UserAccountSchema = new mongoose.Schema({
    "id":String,
    "username": String,
    "account": String,
    "type_account": String,
    "product_type": String,
    "account_name": String,
    "currency": String,
    "card_number": String,
    "status": String,
    "finansial_status": String,
    "default": String,
    "sc_code": String,
});

var UserAccount = mongoose.model('tbl_user_account', UserAccountSchema);
module.exports = UserAccount;
