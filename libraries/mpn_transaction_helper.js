var config = require('../config/config');
var soap = require("soap");
var dateformat = require('dateformat')

exports.inquiryOrderRequest = function(id_setoran) {
	return new Promise(function(resolve,reject){
        var wsdlUrl = config.url_ws_mpn.mpnservice;
        var parameter = {
            MpnData : {
                IdSetoran : id_setoran,  
                MerchantType : config.param.mpn.MerchantType,      
                TransCabang : config.param.mpn.TransCabang,      
                UserIdApp : config.param.mpn.UserIdApp,
                TransMataUang : config.param.mpn.TransMataUang,
                JumlahTransaksi : 1,
                DebetJumlah : 0,
                CreditJumlah : 0,
                TransJumlah : 0,
                TransBiaya : 0
            }
        }

        soap.createClient(wsdlUrl, function(err, soapClient){
			if (err){
				reject(err)
			} else {
				soapClient.SendInquiryEChannel(parameter, function(err, result){
					if(err){
						reject("fail to inquiry from WS MPN : " + err);
					} else {
						resolve(result);
					}
				});
			}
		})

		setTimeout(function(){
			reject("WS Call Timeout");
		}, config.ws_timeout);
	});
};

exports.flaggingRequest = function(param_bill_reference_no, inquiry_mpn_data) {
	return new Promise(function(resolve,reject){
		var wsdlUrl = config.url_ws_mpn.mpnservice;
		var param_inq_data = JSON.parse(inquiry_mpn_data)

		var current_date = dateformat(new Date(), "ddmmyyyy")
		var current_time = dateformat(new Date(), "HHmmss")

        var parameter = {
            MpnData : {
                IdSispen : param_inq_data.IdSispen,
				IdSetoran : param_inq_data.IdSetoran,
				NamaWP : param_inq_data.NamaWP,
				MasaPajak1 : param_inq_data.MasaPajak1,
				MasaPajak2 : param_inq_data.MasaPajak2,
				JumlahTransaksi : param_inq_data.JumlahTransaksi,
				MerchantType : param_inq_data.MerchantType,
				KodeKL : param_inq_data.KodeKL,
				UnitEselon1 : param_inq_data.UnitEselon1,
				Satker : param_inq_data.Satker,
				DebetJumlah : param_inq_data.DebetJumlah,
				CreditJumlah : param_inq_data.CreditJumlah,
				TransCabang : param_inq_data.TransCabang,
				TransJumlah : param_inq_data.TransJumlah,
				TransBiaya : param_inq_data.TransBiaya,
				TransMataUang : param_inq_data.TransMataUang,
				UserIdApp : param_inq_data.UserIdApp,
				TanggalUpdate : param_inq_data.TanggalUpdate,
				SystemTraceAuditNumber : param_inq_data.SystemTraceAuditNumber,
				TanggalSettlement : current_date,
				TanggalTransaksi : current_date,
				JamTransaksi : current_time,
				CreditRekening : config.param.mpn.creditRekening,
				DebetRekening : config.param.mpn.DebetRekening,
				TransJrnSeq1 : param_bill_reference_no
            }
		}
		
		console.log("======================== parameter send to mpn =================================")
		console.log(parameter)

        soap.createClient(wsdlUrl, function(err, soapClient){
			if (err){
				reject(err)
			} else {
				soapClient.SendMpnTransactionEChannel(parameter, function(err, result){
					if(err){
						reject("fail to send flagging request : " + err);
					} else {
						resolve(result);
					}
				});
			}
		})

		setTimeout(function(){
			reject("WS Call Timeout");
		}, config.ws_timeout);
	});
};