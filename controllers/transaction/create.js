//init configuration
var config = require('../../config/config');

//init library
var exception_handler = require('../../libraries/exception_handler');
var transaction_helper = require('../../libraries/transaction_helper');
var validator = require('../../libraries/form_validation/transaction_validation');

var indicative = require('indicative')

//init helper

//init model
var transaction_model = require('../../models/transaction_model');

var result = require('../../models/objectResponse');
var responseLog = require('../../models/responselog');

exports.create = function(req, res) {
    var param_decode = req.body;
    
    //define action for validation purpose
    var action = req.originalUrl
    var rules = validator.rules(action); 

    //init respond variable
    var response_code = "";
    var response_data = {};
    var reference_number = '';

    let promises = []
    let products = []
    let transaction_result = []
    
	//parameter validation, if valid then check merchant wether member of the aggregator's or not
	indicative.validate(param_decode, rules, '').then(function () {
        return transaction_model.save(param_decode)
    })
    .then(function(transaction){
        transaction_result = transaction
        products = JSON.parse(transaction.cart)
        for(let i = 0; i < products.length; i++)
        {
            promises.push(transaction_helper.updateProductProgress(products[i].item.product_id, products[i].item.quantity, products[i].item.total_amount));
        }

        return Promise.all(promises)
    })
    .then(function(updated_products){
        result.responseCode = "00";
        result.responseID = req.requestID;
        result.responseDesc = "penambahan data transaksi berhasil";
        result.responseData = transaction_result;		
        responseLog.saveResponse(result);
        res.send(result);
    })
	.catch(function (errors) {
		console.log(errors);
		exception_handler.handlingError(req, errors, param_decode, res);
	})
};