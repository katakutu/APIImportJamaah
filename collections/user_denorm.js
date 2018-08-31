var mongoose = require('mongoose');

var UserDenormSchema = new mongoose.Schema({
    "username": String,
    "password": String,
    "password_expired": Date,
    "old_password": String,
    "login_retry": String,
    "registered_date": Date,
    "status": String,
    "login_status": String,
    "last_login": Date,
    "login_expired": Date,
    "session_id": String,
    "ip_address_source": String,
    "activation_status": String,
    "password_change_retry": String,
    "agreement_status": String,
    "email_verification_status": String,
    "name": String,
    "born_place": String,
    "born_date": Date,
    "mother_maiden_name": String,
    "address": String,
    "cellphone_number": String,
    "email_address": String,
    "cif": String,
    "user_alias": String
});

var UserDenorm = mongoose.model('tbl_user_denorm', UserDenormSchema);
module.exports = UserDenorm;
