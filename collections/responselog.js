var mongoose = require('mongoose');

var ResponseLogSchema = new mongoose.Schema({
    request:'object',
    response: 'object',
    createdAt: 'date',
    updatedAt: 'date'
}),

ResponseLog = mongoose.model('ResponseLogs', ResponseLogSchema);
module.exports = ResponseLog;
