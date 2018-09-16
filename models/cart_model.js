var cart_collection = require('../collections/tbl_cart');
var query = null;
var statement = null;
var option = null;

exports.saveCart = function (data) {
    return new Promise(function (resolve, reject) {
        let cart = new cart_collection({
            "quantity": data.quantity,
            "total_amount": data.total_amount,
            "product_id": data.product_id,
            "product_name": data.product_name,
            "username": data.username,
            "status": data.status
        });
    
        //Save user to mongoDB
        cart.save(function (err, logs) {
            if (err) {
               reject(err)
            } else {
                resolve(logs)
            }
        })
    })
}