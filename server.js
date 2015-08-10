var fs = require('fs');
var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var passport = require('passport');
var config = require('./config/config');
var port     = process.env.PORT || 8080; // set our port


// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();


mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});
// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
var router = express.Router();
require('./config/routes')(router, passport);
app.use('/', router);

var time = require('time')(Date);

var d = new Date();
d.setTimezone('UTC');
console.log(new Date(d));

//Install application
require('install')(app,function(done){
	if(done){
		app.listen(port);
		console.log('App started on port ' + port);	
	}
	else{
		console.log("Problem with install.js, please consult the development team.")
	}
});

module.exports = app;