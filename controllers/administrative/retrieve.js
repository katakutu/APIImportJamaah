//init configuration
var config = require('../../config/config')

//init library
var exception_handler = require('../../libraries/exception_handler')

const fs = require('fs');
const AdministratifIndonesia = require('administratif-indonesia');
const ai = new AdministratifIndonesia();

var result = require('../../models/objectResponse')
var responseLog = require('../../models/responselog')

exports.retrieve = function(req, res) {
    console.log("njingg")
    var param_decode = req.body;

    //parameter to be processed
    var param_result = {}
    
    //define action for validation purpose
    var action = req.originalUrl

    //init respond variable
    var response_code = "";
    var response_data = {};
    var reference_number = '';

    //console.log(fs.readFileSync(ai.get('31-dki-jakarta'), 'utf8'));
	//parameter validation, if valid then check merchant wether member of the aggregator's or not
    return new Promise(function(resolve, reject){
        resolve(ai.all())
    })
    .then(function(administratif){
        if(!administratif){
            result.responseCode = "AD"
            result.responseID = req.requestID
            result.responseDesc = "Administratif gagal didapatkan"
            result.responseData = ""	
            responseLog.saveResponse(result)
            res.send(result)
        } else {
            result.responseCode = "00"
            result.responseID = req.requestID
            result.responseDesc = "administratif berhasil didapatkan"
            result.responseData = administratif	
            responseLog.saveResponse(result)
            res.send(result)
        }
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};

exports.pluck = function(array, key) {
    return array.map(
        function(item) {
             return item[key]; 
        }
    )
}