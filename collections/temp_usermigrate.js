var mongoose = require('mongoose');

var TempUsermigrateSchema = new mongoose.Schema({
    "username": String,
    "status_migration": String,
    "migration_execution_time": String
});

var TempUsermigrate = mongoose.model('tbl_temp_usermigrate', TempUsermigrateSchema);
module.exports = TempUsermigrate;
