var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
    aa : 'String',
    bb : 'String'
});

var Test = mongoose.model('Tests', TestSchema);
console.log(Test.find())
module.exports = Test;
