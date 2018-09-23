var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    "title"                 :    String,
    "description"           :    String,
    "buy"                   :    String,
    "sell_potential"        :    String,
    "price_bukalapak"       :    String,
    "price_tokopedia"       :    String,
    "price_shopee"          :    String,
    "target_pcs"            :    String,
    "target_rupiah"         :    String,
    "target_date"           :    String,
    "rupiah_collected"      :    String,
    "quantity_collected"    :    String,
    "moq"                   :    String,
    "initiator"             :    String,
    "img_url"               :    String,
});

var Product = mongoose.model('tbl_product', productSchema);
module.exports = Product;
