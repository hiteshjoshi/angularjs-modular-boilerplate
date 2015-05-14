/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var config = require('./../config');
var User = mongoose.model('User');
var coStart = require('coStart');
var Session = mongoose.model('Session');
var jwt = require('jsonwebtoken');

/**
 * Expose
 */

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    var options = {
      criteria: { email: email },
      select: 'name email hashed_password salt is_admin'
    };
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }

      //create session here.
      var token = jwt.sign({_id:String(user._id),name:user.name,email:user.email,is_admin:user.is_admin},config.sessionSecret,{ expiresInMinutes: 60*120 });
      var newSession = new Session({
        user : user._id,
        token:token
      });
      
      newSession.save();
      return done(null, user,{
        sessionToken:newSession.token,
        sessionId:newSession._id
      }); 


    });
  }
);