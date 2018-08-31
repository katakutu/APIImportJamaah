exports.rules = function(action){
	rules = {};
	switch(action){
		case "/authentication/login":
			rules = {
				'username': 'required',
                'password' : 'required'
			}
			break;
	}
	
	return rules;
};
