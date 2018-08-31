module.exports = {
	'relative_path': "../../",
	'secret': 'KONIBRITELKOMBRIMOBILE',
	'ws_timeout' : 60000,
	'ib_channel_id' : 'IBK',

	/* ---------------------------------------------- payment parameter --------------------------------------- */
	'payment_type' : {
		'kartu_kredit_bri' : '4',
		'PLN' : '6',
		'ANZ_personal_loan' : '7',
		'citibank_personal_loan' : '14',
		'HSBC_personal_loan' : '15',
		'SCB_KTA_personal_loan' : '16',
		'BPJSTK' : '48',
		'PLN_NONTAGLIS' : '91'
	},

	'purchase_type' : {
		'BRIZZI' : '14',
		'PLN' : '13'
	},

	'app_server_parameter' : {
		'bpjstk' : 'BPJS'
	}, 

	'pay_amount_type' : {
		'limited_amount' : '0',
		'full_amount' : '1',
		'custom_amount': '2'
	},

	'request_amount' : {
		'close' : '0',
		'open' : '1',
		'combine_close_open' : '2',
	},

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
	
	//List of URL and Service
	'url_ws' : {
		'api_ws' : 'http://172.18.39.10:8080/ApiWS/services/ApiWSPort?wsdl',
		'internet_banking_ws' : 'http://172.18.39.11:8080/InternetBankingWS/services/InternetBankingWSPort?wsdl',
		'dwh_mutasi5_ws' : 'http://172.18.41.103/ws_trx_rc/index.php/services',
		'dwh_mutasi5_ws_alt' : 'http://172.18.41.104/ws_trx_rc/index.php/services',
		'dwh1_ws' : 'http://172.18.41.49/ibapps/public/transactionws?wsdl',
		'dwh2_ws' : 'http://172.18.41.49/ibapps2/public/transactionws?wsdl',
		'ssb_ws' : 'http://172.18.44.62:8080/WsHybrid/services/SSBServiceImpl?wsdl',
		'bancass_ws' : 'http://10.107.11.206:8081//WsHybrid/services/BancassService?wsdl',
		'camsservice_url' : "http://1.0.0.2/service/pswcgi",
		'shadow_camsservice_url' : "http://1.0.0.2/service/pswcgi",
		'tbank_url' : "http://172.21.49.32:8387/BrivaTelkomService.asmx?wsdl",
		'pswservice_url' : "http://2.0.0.213/poscgi/pswcgi/method=post&data=json",
		'smsemail' : "http://172.21.56.134:9995/Service.asmx?wsdl",
		'formless_ws' : 'http://172.18.44.61/formless/public/transactionws?wsdl',
		'regnotif_ws' : 'http://172.21.56.134:9995/Service.asmx?wsdl',
		'saham_ws' : 'http://172.18.104.19:4005/api/v1/saham/file',
		'promo_ws': 'http://10.35.65.115/bripromo/services',
		'ektp_ws' : 'http://172.18.44.62:8080/WsEktp/reqEktp.do',
		'ldap_ws' : 'http://172.21.50.22/beranda/ldap/ws/ws_adUser.php?wsdl',
		'bpjstk_ws' : 'http://10.35.65.77:111/BPJSTKService.asmx?wsdl'
	},

	'ws_pdm' : {
		'near_branch' : 'http://172.18.41.129/location/near/branch/',
		'near_atm' : 'http://172.18.41.129/location/near/atm/',
		'req_token' : 'http://172.18.41.129/oauth/token',
		'grant_type' : 'client_credentials',
		'client_id' : '80af9b0b3f3ee5c068cdf8f31509b597cc3046a2',
		'client_secret' : 'c056dfeca66f6988973c3608859107e6018a538c',
		'cif_customer' : 'http://172.18.41.129/customer/cfmast/',
		'area_branch' : 'http://172.18.41.129/location/area/branch/',
		'area_atm' : 'http://172.18.41.129/location/area/atm/',
		'req_token_tbank' : 'http://172.18.41.129/oauth/token',
		'client_id_tbank' : 'adcacccddc4f11ab4448fa8ab2bc01b6d835719d',
		'client_secret_tbank' : '08ad3838acd61e41bd03ba89e22404b9d6806965',
		'mutasi_tbank' : 'http://172.18.41.129/echannel/tbank/mutasi/',
		'tbank_token' : require('../collections/tokenlocator').token
	},

	 'config_db' : {
		'wbs' : {
				'ip' : '2.0.0.81',
				'username' : 'root',
				'password' : 'root',
				'schema' : 'autopayment',
		},

		'ib' : {
				'ip' : "172.21.20.71",
				'username' : 'briopr',
				'password' : 'P@ssw0rd',
				'schema' : 'ibank',
		},
		
		'psw_mq_log' : {
			'ip' : "10.35.65.18",
			'username' : 'briopr',
			'password' : 'Tanyapakkholis',
			'schema' : 'psw_mq_log',
		},

		'ib_mongoDB' : "mongodb://localhost:27017/ibapi",

		'locator_mongoDB': "mongodb://localhost/locator"
	},

	'global_var' : {
		'express' : require("express"),
		'indicative' : require("indicative"),
		'soap' : require("soap"),
		'sha256': require("crypto-js/sha256"),
		'dateformat' : require('dateformat')
	},

	'parameter' : {
		'useridBrinet1' : '9999901'
	},
	'tbank' : {
		'kode_instansi' : '77777',
		'password' : 'ECHANNEL',
		'pin_key' : 'BRI1',
		'ia_voucher' : '039101000105990',
		'ia_cashback' : '039101000105990',
		'pswservice_channel_id' : 'NEWIBBRI',
		'pswservice_key' : 'NEWIBBRI1234567890',
		'pswservice_card_number' : '5221844123456789'
	},
	'cams' : {
		'channel_id' : 'NBM',
		'password' : "nbm2101",
	},
	'ssb_var' : {
		'channel' : 'NBM', 		// fix 3 digit | alpahnumeric
		'branch' : '0206', 		// fix 4 digit | numeric
		'user_number' : '891'	// fix 3 digit | numeric
	},
	'push_notification' : {
		'url_login' : 'http://10.35.65.247:8080/authService/accounts/login',
		'url_send_notif' : 'http://10.35.65.247:8080/kpns/api/v1/message',
		'login_userid' : 'om.hendra@telkom.co.id',
		'login_password' : 'P@ssw0rd',
		'app_id' : '21888-4680602889',
		'ufid' : 'hendraph9@gmail.com'
	},
	'trx_category' : {
		'bancass' : 'Bancassurance',
		'ssb' : 'SSB',
		'tbank' : 'Tbank',
		'tartun' : 'Tartun'
	},

	'user_piloting' : [
		'adhon.rizky@gmail.com',
		'adhon.rikzy@gmail.com'
	],

	'status_piloting' : false, 

	'paytype_wflagging' : [
		'48', //BPJSTK 
	],

	'product_type' : {
		'bpjstkpu' : '30115',
		'bpjstkbpu' : '30124',
	}
};
