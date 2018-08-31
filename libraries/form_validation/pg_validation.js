exports.rules = function(action){
	rules = {};
	switch(action){
		case "/transaction/initiate":
			rules = {
				'billing_code': 'required|min:15|max:15',
				'merchant_id' : 'required|min:6|max:6',
				'amount' : 'required|above:0',
				'redirect_page' : 'required'
			}
			break;
		case "/transaction/redirect":
			rules = {
				'keys_trxecomm': 'required|alpha_numeric'
			}
			break;
		case "/transaction/status":
			rules = {
				'merchant_reference_no': 'required',
				'merchant_id': 'required|min:6|max:6',
				'billing_code': 'required|min:15|max:15'
			}
            break;
	}
	
	return rules;
};
