//init library
var express = require('express');
var bodyParser = require('body-parser');
var dateformat = require('dateformat');
var sha256 = require("crypto-js/sha256");
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');

//init model
var requestLog = require('./models/requestlog');

//init config
var config = require('./config/config');
var db = require('./config/database');

var app = module.exports = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //My frontend APP domain
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

//Init routes
var administrative = require('./routes/administrative')
var user = require('./routes/user');
var authentication = require('./routes/authentication')
var product = require('./routes/product')
var cart = require('./routes/cart')
var transaction = require('./routes/transaction')

// view engine setup
app.set('port', process.env.PORT || 4009);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.set('trust proxy', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// save log into mongoDB
app.use('/:any', requestLog.saveRequest);

// set routes
app.use('/administrative', administrative)
app.use('/user', user)
app.use('/authentication', authentication)
app.use('/product', product)
app.use('/cart', cart)
app.use('/transaction', transaction)

app.use('*', function(req,res){
  res.send("Ooopss... Where are you going bruhh??")
}) 

// Creating MongoDB connection
mongoose.connect(config.config_db.ib_mongoDB, {server: { poolSize: 5 }});

var conn = mongoose.connection;
conn.once('open', function (errmg){
  if (errmg) {
    console.log('Connection to MongoDB error: ' + errmg);
    process.exit(1);
  } else {
    app.listen(app.get('port'),function(){
      console.log('Express server lisening on port ' + app.get('port'));
      console.log(process.env.NODE_ENV)
    });
    console.log("Mongoose connection opened on process " + process.pid);
  }
});

//if the connection throws an error
conn.on('error', function(err){
  console.log('Mongoose default connection disconnected error' + err)
})

//when the connection is disconnected
conn.on('disconnected', function(){
  console.log('Mongoose default connection disconnected')
})

//if the node process ends, close the mongoose connection
process.on('SIGINT', function(){
  conn.close(function(){
    console.log('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.send(err);
});

module.exports = app;
