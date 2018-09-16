var product_collection = require('../collections/tbl_product');
var query = null;
var statement = null;
var option = null;

exports.saveProduct = function (data) {
    return new Promise(function (resolve, reject) {
        let product = new product_collection({
            "username": data.username,
            "password": data.password,
            "password_expired": data.password_expired,
            "old_password": data.old_password,
            "login_retry": data.login_retry,
            "registered_date": data.registered_date,
            "status": data.status,
            "login_status": data.login_status,
            "last_login": data.last_login,
            "login_expired": data.login_expired,
            "session_id": data.session_id,
            "ip_address_source": data.ip_address_source,
            "email_verification_status": data.email_verification_status,
            "name": data.name,
            "address": data.address,
            "phone": data.phone,
            "email": data.email,
        });
    
        //Save prdouct to mongoDB
        product.save(function (err, logs) {
            if (err) {
               reject(err)
            } else {
                resolve(logs)
            }
        })
    })
}

exports.retrieve = function(data){
    return new Promise(function (resolve, reject) {
        query = data
        delete query.requestID
        console.log(query)
		product_collection.find(query, function(err, product){
            if(err) { 
                reject(err);
            } else {
                resolve(product);
            }
        })
	})
}