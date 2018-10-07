var user_collection = require('../collections/tbl_user');
var query = null;
var statement = null;
var option = null;

exports.saveUser = function (data) {
    return new Promise(function (resolve, reject) {
        let user = new user_collection({
            "username": data.username,
            "password": data.password,
            "password_expired": data.password_expired,
            "old_password": data.old_password,
            "login_retry": data.login_retry,
            "registered_date": data.registered_date,
            "status": data.status,
            "login_status": data.login_status,
            "last_login": data.last_login,
            "login_expired": data.login_expired,
            "session_id": data.session_id,
            "ip_address_source": data.ip_address_source,
            "email_verification_status": data.email_verification_status,
            "name": data.name,
            "address": data.address,
            "phone": data.phone,
            "email": data.email,
        });
    
        //Save user to mongoDB
        user.save(function (err, logs) {
            if (err) {
               reject(err)
            } else {
                resolve(logs)
            }
        })
    })
}

exports.findOrCreate = function (data, update, done) {
    user_collection.findOrCreate(data, update, function(err, result){
        done(null, result)
    })
}

exports.retrieve = function(username){
    let query = {username : username}
    return user_collection.findOne(query).exec()
}

exports.retrieveByUserAlias = function(data){
    return new Promise(function (resolve, reject) {
        query = {user_alias : data};
		userDenorm.findOne(query, function(err, user){
            if(err) { 
                console.log(err)
                reject(err);
            } else {
                resolve(user);
            }
        })
	})
}

exports.updateLoginRetry = function (username, login_retry, done) {
    query = {username : username};
    statement = {$set : {login_retry:login_retry}}
    option = {
        upsert: false,
        multi : false
    }
    userDenorm.update(query, statement, option, function(err, user){
        if (err) return done(err);
        done(null);
    })
};

exports.setLoginExpired = function (username, done) {
    query = {username : username};
    console.log( new Date(new Date().getTime() + 10*60000))
    statement = {$set : {login_expired : new Date(new Date().getTime() + 10*60000)}}
    option = {
        upsert: false,
        multi : false
    }
    userDenorm.update(query, statement, option, function(err, user){
        if (err) return done(err);
        done(null);
    })
};

exports.clearLoginExpired = function (username, done) {
    query = {username : username};
    statement = {$set : {login_expired : null, login_status : 0}}
    option = {
        upsert: false,
        multi : false
    }
    userDenorm.update(query, statement, option, function(err, user){
        if (err) return done(err);
        done(null);
    })
};

exports.updateLoginSuccessfull = function (username, login_retry, login_status, ip_address, token_id, done) {
    query = {username : username};
    statement = {$set : {login_retry : login_retry, login_status : login_status, ip_address_source : ip_address, session_id : token_id}}
    option = {
        upsert: false,
        multi : false
    }
    userDenorm.update(query, statement, option, function(err, user){
        if (err) return done(err);
        done(null);
    })
};

exports.updateLastLogin = function (username, done) {
    query = {username : username};
    statement = {$set : {last_login : new Date()}}
    option = {
        upsert: false,
        multi : false
    }
    userDenorm.update(query, statement, option, function(err, user){
        if (err) return done(err);
        done(null);
    })
};

exports.updateLoginStatus= function (username, login_status, done) {
    query = {username : username};
    statement = {$set : {login_status : login_status}}
    option = {
        upsert: false,
        multi : false
    }
    userDenorm.update(query, statement, option, function(err, user){
        if (err) return done(err);
        done(null);
    })
};


exports.updateStatusUser = function (username, status, done) {
    query = {username : username};
    statement = {$set : {status : status}}
    option = {
        upsert: false,
        multi : false
    }
    userDenorm.update(query, statement, option, function(err, user){
        if (err) return done(err);
        done(null);
    })
};