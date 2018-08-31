let mongoose = require("mongoose");

let Schema = mongoose.Schema;
let tokenSchema = new Schema({
	access_token: String,
	expires_in: Number,
	token_type: String,
	scope: String,
	client_id : String,
	channel : String,
	timestamp : {type : Date, default : Date.now},
	source : {type : String, default : 'client'}
});
 
let token = mongoose.model("token_service", tokenSchema, 'tokens');
module.exports = token; 