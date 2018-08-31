var mysql = require('mysql');
var async = require('async');
var config = require('./config');

var PRODUCTION_DB = config.config_db.aggregator_mpn.schema;
var TEST_DB = config.config_db.aggregator_mpn.schema;

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
  pool: null,
  mode: null,
}

exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: config.config_db.aggregator_mpn.ip,
    user: config.config_db.aggregator_mpn.username,
    password: config.config_db.aggregator_mpn.password,
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
