let mongoose = require("mongoose");

let Schema = mongoose.Schema;
let tokenSchema = new Schema({
	access_token: String,
	expires_in: Number,
	token_type: String,
	scope: String,
	timestamp : {type : Date, default : Date.now},
	source : {type : String, default : 'BSSN'}
});
 
let token = mongoose.model("token_bssn", tokenSchema, 'tokens');
module.exports = token;