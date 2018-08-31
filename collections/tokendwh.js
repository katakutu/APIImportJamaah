var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var tokenSchema = new Schema({
	access_token: String,
	expires_in: Number,
	token_type: String,
	scope: String,
	timestamp : {type : Date, default : Date.now},
	source : {type : String, default : 'DWH'}
});
 
var token = mongoose.model("token_dwh", tokenSchema, 'tokens');
module.exports = token;