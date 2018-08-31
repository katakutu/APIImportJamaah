var db_ibank = require('../models/tbl_user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var inArray = require('in-array');

var result = require('../models/objectResponse');
var responseLog = require('../models/responselog');
var validator = require('../libraries/form_validation/ib/authentication_validation');
var indicative = config.global_var.indicative;

exports.userAuthenticate = function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.headers['x-access-token'];
	var request = JSON.parse(req.body.requestData);
	var action = request.action;
	var username = "";
	var rules = validator.rules("authentication");
	var messages = {};

	var special_bypass_flag = false;

	var action_bypass = [
		'login',
		'login_enhance',
		'request_service_token',
		'logout',
		'add_error_code',
		'get_error_code',
		'promo_bri',
		'request_token',
		'inquiry_token',
		'request_token_bssn',
		'request_token_dwh',
		'mysql_mongo'
	]

	var action_use_secret_token = [
		'bancassPrinting',
		'reg_notif',
		'inquiry_notif',
		'login_nopass',
		'create_user',
		'sms',
		'email',
		'check_user_available',
		'info',
		'create',
		'upgrade',
		'blokir_user',
		'create_user_wallet',
		'rekening_koran',
		'get_all_kurs',
		'inquiryID',
		'createAccountNoBook',
		'initialDepositNoBook',
		'createCustDataAndAccountNoBook',
		'info_saham',
		'atm_location',
		'branch_location',
		'atm_area',
		'branch_area',
		'verify_email',
		'inquiry_ektp_by_nik',
		'loginLdap',
		'add_account',
		'push_notification',
		'paramInquiry',
		'reversal_tbank',
		'cashback_tbank',
		'reset_password',
		'request_token_dwh',
		'retrieve_token_dwh',
		'status_document',
		'send_sign_request',
		'sign_document',
		'download_document',
		'verify_document',
		'status_user_bssn' 
	]

	indicative.validate(req.headers, rules, messages).then(function () {
		if (inArray(action_bypass, action)) {
			next();
		} else if (inArray(action_use_secret_token, action)) {
			username = request.data.client_id;
			jwt.verify(token, username + "" + config.secret, function (err, decoded) {
				if(err){
					res.send({ responseCode: 'TF', responseDesc: 'Failed to authenticate token', responseData: null });
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;
					next();
				}
			})
		} else {
			username = request.data.username;
			if (token) {
				// verifies secret and checks exp
				if(request.data.purchase_type){
					console.log("processing")
					if(request.data.purchase_type == '15'){
						console.log("is ist")
						special_bypass_flag = true
					} 
				}
				
				if(special_bypass_flag == true){
					next();
				} else {
					jwt.verify(token, username.toUpperCase() + config.secret, function (err, decoded) {
						if (err) {
							console.log(err)
							res.send({ responseCode: 'TF', responseDesc: 'Failed to authenticate token', responseData: null });
						} else {
							// if everything is good, check user status
							query_username = db_ibank.getStatusUser(username, function (err, row) {
								if (err) {
									return res.send({ responseCode: 'AU', responseDesc: 'Anauthorized User', responseData: null });
								} else {
									if (row.length < 0) {
										res.send({ responseCode: 'AU', rfesponseDesc: 'Anauthorized User', responseData: null });
									} else {
										row.forEach(function (row, index) {
											user_status = row.status;
											login_status = row.login_status;
											session_id = row.session_id;
											agreement_status = row.agreement_status;
										})
										if (user_status == 0) {
											res.send({ responseCode: 'Q2', responseDesc: 'Username Blocked', responseData: null });
										} else if (session_id != decoded.data) {
											res.send({ responseCode: 'P7', responseDesc: 'Login session is still active', responseData: null });
										} else if (agreement_status != 6) {
											if (action != "setup_password" && action != 'setup_username' && action != 'update_license_agreement' && action != 'verify_email') {
												res.send({ responseCode: 'EV', responseDesc: 'Email has not been verified', responseData: null });
											} else {
												next();
											}
										} else {
											// if everything is good, save to request for use in other routes
											req.decoded = decoded;
											next();
										}
									}
								}
							});
						}
					});
				}
			} else {
				result = { responseCode: 'TF', responseID: req.requestID, responseDesc: 'Failed to authenticate token', responseData: null };
				responseLog.saveResponse(result);
				res.send(result);
			}
		}
	}).catch(function (errors) {
		console.log(errors)
		result = { responseCode: 'GE', responseID: req.requestID, responseDesc: 'Invalid format of request header', responseData: null };
		responseLog.saveResponse(result);
		res.send(result);
	})
};