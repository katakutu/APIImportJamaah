var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var tokenSchema = new Schema({
	access_token: 'string',
	expires_in: 'number',
	token_type: 'string',
	scope: 'string'
});
 
var token = mongoose.model("tokens", tokenSchema);
module.exports.token = token;