var db = require('../config/database.js');

exports.getRRN = function(done) {
	db.get().query('UPDATE tbl_rrn SET rrn = LAST_INSERT_ID(rrn+1) WHERE id = 1; SELECT LAST_INSERT_ID() as rrn', function (err, rows) {
	    if (err) return done(err);
	   	done(null, rows[1]);
  	});
};

exports.getRRNPromise = function() {
	return new Promise(function (resolve, reject) {
		db.get().query('UPDATE tbl_rrn SET rrn = LAST_INSERT_ID(rrn+1) WHERE id = 1; SELECT LAST_INSERT_ID() as rrn', function (err, rows) {
			if (err) {
				console.log(err)
				reject(err);
			} else {
				resolve(rows[1][0].rrn);
			}
	  });
	});
};