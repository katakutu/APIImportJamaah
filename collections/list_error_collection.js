var mongoose = require('mongoose');

var ListErrorSchema = new mongoose.Schema({
    rc : 'string',
    action : 'string',
    trx_type : 'string',
    trx_type_id : 'string',
    trx_group_id : 'string',
    trx_category : 'string',
    title_id : 'string',
    title_en : 'string'
}),

ListError = mongoose.model('list_error', ListErrorSchema);
module.exports = ListError;
