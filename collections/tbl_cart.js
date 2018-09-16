var mongoose = require('mongoose');

var CartSchema = new mongoose.Schema({
    "quantity": String,
    "total_amount": String,
    "product_id": String,
    "product_name": String,
    "username": String,
    "create_date": Date,
    "status": String
});

var Cart = mongoose.model('tbl_cart', CartSchema);
module.exports = Cart;
