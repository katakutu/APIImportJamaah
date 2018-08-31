exports.rules = function(action){
	rules = {};
	switch(action){
		case "/user/register":
			rules = {
				'username': 'required',
                'password' : 'required',
                'phone':'required',
                'email':'required'
			}
			break;
	}
	
	return rules;
};
