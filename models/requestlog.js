var RequestLog = require('../collections/requestlog');
var logger = require('../libraries/logger');

exports.saveRequest = function (req, res, next) {
    var param_decode = {}
    var loggedMessage = {}
    var requestLogIn = {}
    //handle for POST method
    if(req.method == "POST"){
        param_decode = req.body
        loggedMessage = param_decode;

        requestLogIn = new RequestLog({
            requestMethod: req.originalUrl,
            requestData: loggedMessage,
            ip_address: req.headers['ip_client'],
            user_agent: req.headers['user_agent'],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        //Save request log to mongoDB
        requestLogIn.save(function (err, logs) {
            if (err) {
                console.log('Error: ' + err);
            } else {
                //console.log('Save Request Logs ' + logs);
                req.requestID = logs._id;
                loggedMessage.requestID = logs._id;
                //console.log("======================= START LOG : " + param_decode.action + " =====================")
                //console.log("--------------------------------- REQUEST ---------------------------------") 
                logger.info("REQUEST (" + req.originalUrl + ") --> " + JSON.stringify(loggedMessage));
                next();
            }
        });
    } else if(req.method == "GET"){
        param_decode = req.query
        loggedMessage = param_decode;
       
        requestLogIn = new RequestLog({
            requestMethod: req.baseUrl,
            requestData: loggedMessage,
            ip_address: req.headers['ip_client'],
            user_agent: req.headers['user_agent'],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        //Save request log to mongoDB
        requestLogIn.save(function (err, logs) {
            if (err) {
                console.log('Error: ' + err);
            } else {
                //console.log('Save Request Logs ' + logs);
                req.requestID = logs._id;
                loggedMessage.requestID = logs._id;
                //console.log("======================= START LOG : " + param_decode.action + " =====================")
                //console.log("--------------------------------- REQUEST ---------------------------------") 
                logger.info("REQUEST (" + req.baseUrl + ") --> " + JSON.stringify(loggedMessage));
                next();
            }
        });
    } else {
        next();
    }
}
