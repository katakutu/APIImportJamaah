exports.rules = function(action){
	rules = {};
	switch(action){
		case "/transaction/inquiry":
			rules = {
				'bill_reference_no': 'required|max:15',
				'merchant_id' : 'required|min:6|max:6',
			}
			break;
		case "/inquiryOrderRequest":
			rules = {
				'billReferenceNo': 'required|max:15',
				'payeeId' : 'required|min:6|max:6',
			}
			break;
		case "/transaction/payment":
			rules = {
				'bill_reference_no': 'required|max:15',
				'merchant_id' : 'required|min:6|max:6',
				'bank_reference_no' : 'required',
				'transaction_date' : 'required',
				'user_fullname' : 'required',
				'status' : 'required|in:S,F',
			}
			break;
		case "/updateTransactionStatus":
			rules = {
				'billReferenceNo': 'required|max:15',
				'payeeId' : 'required|min:6|max:6',
				'paymentRefNo' : 'required',
				'transactionTime' : 'required', 
				'userFullName' : 'required',
				'status' : 'required|in:S,F',
			}
			break;
	}
	
	return rules;
};
