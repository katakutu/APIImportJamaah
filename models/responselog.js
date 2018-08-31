var ResponseLog = require('../collections/responselog');
var RequestLog = require('../collections/requestlog');
var logger = require('../libraries/logger');
var config = require('../config/config');

exports.saveResponse = function(result){
  var ObjectId = require('mongoose').Types.ObjectId;
  var query = {"_id": new ObjectId(result.responseID)};
  var param_response = "";

  RequestLog.findOne(query, function (err, requestlogs) {
    if(result.responseCode == config.error_code.general.rc){
      result.responseData = "";
    }

    if (err) {
      param_data = {response:result, createdAt:new Date(), updatedAt:new Date()};
    } else {
      param_data = {request:requestlogs, response:result, createdAt:new Date(), updatedAt:new Date()};
    }

    var responseLogIn = new ResponseLog(param_data);

    responseLogIn.save(function (err, logs) {
      if (err) {
        console.log('Error: ' + err);
      } else {
        //console.log('Save Response Logs ' + logs);
      }
    });
    //console.log("--------------------------------- RESPONSE ---------------------------------")
    logger.info("RESPONSE (" + requestlogs.requestMethod + ") --> " + JSON.stringify(result));
    //console.log(" -------------------------- END OF TRANSACTION " + requestlogs.requestMethod + " -----------------------------")
    //console.log("======================================== ================================ ===")

  });
}

exports.retrieve = function(action, rc, done){
  ResponseLog.findOne({_id : "5aa114803fc78b11a424b5db"}, function(err, errorObj){
      if(err) { 
          console.log(err)
          return done(err);
      } else {
          return done(null, errorObj);
      }
  }) ;   
}