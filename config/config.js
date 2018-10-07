module.exports = {
	'ws_timeout' : 30000,
	'ib_channel_id' : 'IBK',
	'secret': 'KONIBRITELKOMBRIMOBILE',

	/* -------------------------------------------- payment parameter --------------------------------------- */
	'error_code' : {
		"validation" : {
			'rc' : 'VE',
			'desc' : 'Validation Error'
		},
		"general" : {
			'rc' : 'GE',
			'desc' : 'General Error'
		}
	},

	'response_code' : {
		'success' : "00"
	},

	//List of URL and Service
	'url_ws_pg' : {
		'insert_payment' : 'http://10.35.65.18/payment_gateway/InsertPaymentParameters',
		'reversal_payment' : 'http://10.35.65.18/payment_gateway/ReversalTransaction',
		'status_enquiry' : 'http://10.35.65.18/payment_gateway/StatusEnquiry'
	},
	'url_ws_mpn' : {
		'mpnservice' : 'http://10.35.65.108:8388/MpnService.asmx?wsdl'
	},  

	'param' : {
		'mpn' : {
			'MerchantType' : '7014',    
			'TransCabang' : '9997',
			'UserIdApp' : '9997003',
			'TransMataUang' : 'IDR',
			'DebetRekening' : '301001001071509',
			'rc_reversal' : ['88','27','02'],
			'creditRekening': '020601002042305'
		},
		'pg' : {
			'merchant_id' : '022001'
		},
		'status' : {
			'transaction_fail': 'F',
			'transaction_success': 'S',
		},
		'transaction_step' : {
			'code' :{
				'init_transaction' : '0',
				'success_epay' : '1',
				'fail_epay' : '2',
				'success_mpn' : '3',
				'fail_mpn' : '4',
				'success_merchant' : '5',
				'fail_merchant' : '6'
			},
			'desc' : {
				'init_transaction' : 'success insert transaction to ePay',
				'success_epay' : 'success payment ePay',
				'fail_epay' : 'fail payment ePay',
				'success_mpn' : 'success flagging MPN',
				'fail_mpn' : 'fail flagging MPN',
				'success_merchant' : 'success flagging Merchant',
				'fail_merchant' : 'success flagging Merchant'
			}
			
		}
	},

	facebook : {
		client_id : '881998715303945',
		client_secret : '93c75196251172f7de76e772a0864123',
		callback_url : 'http://localhost:4009/authentication/login-facebook'
	},
  
	'config_db' : {
		'aggregator_mpn' : {
			'ip' : "10.35.65.18",
			'username' : 'briopr',
			'password' : 'Tanyapakkholis',
			'schema' : 'epay_aggregator_mpn',
		},
		'ib_mongoDB' : "mongodb://localhost:27017/import_jamaah"
	}
};
