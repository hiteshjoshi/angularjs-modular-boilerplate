/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./../config');
var User = mongoose.model('User');
var coStart = require('coStart');
var Session = mongoose.model('Session');
var uuid = require('node-uuid');
var jwt = require('jsonwebtoken');


/**
 * Expose
 */

 module.exports = new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log(accessToken, refreshToken, profile);
  	var options = {
      criteria: { email: profile._json.email }
    };
    User.load(options, function (err, user) {
      if (err) 
      	return done(err);
      else {
	      if (!user) {
	      	//NO USER FOUND, lets create ONE.
	      	var newUser = new User({
	      		first_name:profile._json.first_name,
	      		
	      		last_name:profile._json.last_name,
	      		
	      		email:profile._json.email,
	      		
	      		gender:coStart.genderNumber(profile._json.gender),

	      		email_verified:profile._json.verified,
	      		
	      		bio:profile._json.bio,

	      		avatar: 'https://graph.facebook.com/'+profile._json.id+'/picture?type=large',

	      		facebook:profile._json
	      	});
	      	newUser.save(function(err,user){
	      		if(err) return done(err,false,{message:'Server error'});
	      		//create session here.
	      		var token = jwt.sign({first_name:user.first_name,avatar:user.avatar,last_name:user.last_name,email_verified:user.email_verified},config.sessionSecret,{ expiresInMinutes: 60*120 });
	      		var newSession = new Session({
	      			user : user._id,
	      			token:token
	      		});
	      		
	      		newSession.save();
	      		return done(null, user,{
	      			sessionToken:token
	      		});	
	      	});
	      }
	      else{

	      	//create session here.
	      	var token = jwt.sign({first_name:user.first_name,avatar:user.avatar,last_name:user.last_name,email_verified:user.email_verified},config.sessionSecret,{ expiresInMinutes: 60*120 });
	      	
      		var newSession = new Session({
      			user : user._id,
      			token:token
      		});
      		newSession.save();

	      	return done(null, user,{sessionToken:
	      		token
	      	});	
	      }
	  };
    });
  }
);