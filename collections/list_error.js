var mongoose = require('mongoose');

var ListErrorSchema = new mongoose.Schema({
    rc : String,
    action : String,
    trx_type_id : String,
    trx_group_id : String,
    trx_category : String,
    title_id : String,
    title_en : String
});

var ListError = mongoose.model('List_error', ListErrorSchema);
module.exports = ListError;
