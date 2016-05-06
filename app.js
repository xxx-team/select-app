var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo =require('mongodb');
var mongoose=require('mongoose');
var session=require('express-session');
// mongoose.connect('mongodb://thuongdv_58:mothaiba@ds019980.mlab.com:19980/mydatabasehihi');
mongoose.connect('127.0.0.1:27017')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});
// register models

var app = express();
var sessionOptions = {
    secret: "secret",
    resave : true,
    saveUninitialized : false
  };
app.use(session(sessionOptions));

require('./models');
var routes = require('./routes/index');
var users = require('./routes/users');
var usertask = require('./routes/usertask');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//added db
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/user',usertask);


// We need to use cookies for sessions, so use the cookie parser middleware
//var MongoStore = require('connect-mongo')(express);
// app.use(expressSession({
//     secret: 'a4f8071f-c873-4447-8ee2',
//     cookie: { maxAge: 2628000000 },
//     store: new (require('express-sessions'))({
//         storage: 'mongodb',
//         instance: mongoose, // optional 
//         host: 'localhost', // optional 
//         port: 27017, // optional 
//         db: 'test', // optional 
//         collection: 'sessions', // optional 
//         expire: 86400 // optional 
//     })
//   //   store: new MongoStore({
//   //   db: 'selected_app',
//   //   host: '127.0.0.1',
//   //   port: 3355
//   // })
// }));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
