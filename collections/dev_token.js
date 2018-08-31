var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var tokenSchema = new Schema({
	access_token: 'string',
	expires_in: 'number',
	token_type: 'string',
	scope: 'string'
});
 
var token = mongoose.model("dev_tokens", tokenSchema);
module.exports.dev_token = token;