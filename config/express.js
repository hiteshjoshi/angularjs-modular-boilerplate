var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf');
var winston = require('winston');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var env = process.env.NODE_ENV || 'development';
var config = require('./config');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var expressValidator = require('express-validator')

module.exports = function (app, passport) {
  winston.emitErrs = true;

  if(env === 'production'){

    var logger = new winston.Logger({
      transports: [
          new winston.transports.File({
              name : 'info',
              level: 'info',
              filename: config.logDir + '/info.log',
              handleExceptions: true,
              json: true,
              maxsize: 5242880, //5MB
              maxFiles: 5,
              colorize: true
          }),
          new winston.transports.File({
              name : 'error',
              level: 'error',
              filename: config.logDir + '/error.log',
              handleExceptions: true,
              json: true,
              maxsize: 5242880, //5MB
              maxFiles: 5,
              colorize: true
          }),
          new winston.transports.File({
              level: 'debug',
              filename: config.logDir + '/debug.log',
              handleExceptions: true,
              json: false,
              colorize: true
          })
      ],
      exitOnError: false
    });  
  }
  else{
    var logger = new winston.Logger({
      transports: [
          new (winston.transports.Console)()
      ],
      exitOnError: true
    });  
  }

  module.exports = logger;
  module.exports.stream = {
      write: function(message, encoding){

          logger.info(message);
      }
  }; 

  if (env !== 'test' ) app.use(require('morgan')({ "stream": logger.stream }));

  // bodyParser should be above methodOverride
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());


  app.use(expressValidator({
    customValidators: {
        phone: function(value) {
          var number_format = "(999)999-9999|999-999-9999|9999999999";
          var number_regex = RegExp("^(" +
                         number_format
                           .replace(/([\(\)])/g, "\\$1")
                           .replace(/9/g,"\\d") +
                         ")$");

            return number_regex.test(value);
        }
     }
  }));

  app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));



  app.use(cookieParser());
  app.use(cookieSession({ secret: 'thisisareallylongandbigsecrettoken',domain:config.cookieDomain }));

  
  // app.use(session({
  //   resave: true,
  //   saveUninitialized: false,
  //   secret: 'thisisareallylongandbigsecrettoken',
  //   store: new mongoStore({
  //     url: config.db,
  //     collection : 'express_sessions'
  //   }),
  //   domain:config.cookieDomain,
  //   // cookie:{
  //   //   path: '/',
  //   //   maxAge: 24*60*1000,
  //   //   domain:domain
  //   // }
  // }));

  app.use(passport.initialize());
  //app.use(passport.session());




  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override,Authorization, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
         res.send(200);
     } else {
         next();
     }
  });




  // adds CSRF support
  if (process.env.NODE_ENV != 'test') {

    app.use(function(err,req, res, next){


      /**
      ** REGEX for urls related to mailin.io
      **/
      var p = new RegExp('.*?(email_parsing)',["i"]);
      
      var m = p.exec(req.path);
      console.log(req.headers,req.body);
      if (m != null) {
        return next();
      }

      else
        return next();

    });
  }
};