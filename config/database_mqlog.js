var mysql = require('mysql');
var config = require('./config');

var PRODUCTION_DB = config.config_db.psw_mq_log.schema;
var TEST_DB = config.config_db.psw_mq_log.schema;

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
  pool: null,
  mode: null,
}

exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: config.config_db.psw_mq_log.ip,
    user: config.config_db.psw_mq_log.username,
    password: config.config_db.psw_mq_log.password,
    database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB,
    multipleStatements : true,
  })

  state.mode = mode;
  done();
}

/**** DEFER *****/
/*
exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: config.config_db.ib_defer.ip,
    user: config.config_db.ib_defer.username,
    password: config.config_db.ib_defer.password,
    database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB,
    multipleStatements : true,
  })

  state.mode = mode;
  done();
}
*/

exports.get = function() {
  return state.pool;
}
