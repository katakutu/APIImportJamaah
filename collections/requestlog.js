var mongoose = require('mongoose');

var RequestLogSchema = new mongoose.Schema({
    requestMethod: 'string',
    requestData: 'object',
    ip_address: 'string',
    user_agent: 'string',
    createdAt: 'date',
    updatedAt: 'date'
}),

RequestLog = mongoose.model('RequestLogs', RequestLogSchema);
module.exports = RequestLog;
