var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
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
    "email_verification_status": String,
    "name": String,
    "address": String,
    "phone": String,
    "email": String,
    "user_alias": String
});

var User = mongoose.model('tbl_user', UserSchema);
module.exports = User;
