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
      Session.findOne({user:user._id})
      .exec(function(err,user_data){
        if(!user_data){
          var token = jwt.sign({_id:String(user._id),firstName:user.firstName,lastName:user.lastName,email:user.email,is_admin:user.is_admin},config.sessionSecret,{ expiresInMinutes: 60*120 });
          var newSession = new Session({
            user : user._id,
            token:token
          });
          newSession.save();
          return done(null, user,{
            sessionToken:newSession.token,
            sessionId:newSession._id
          });           
        }
        else{
          console.log("user_data",user_data);
          var token = jwt.sign({_id:String(user._id),firstName:user.firstName,lastName:user.lastName,email:user.email,is_admin:user.is_admin},config.sessionSecret,{ expiresInMinutes: 60*120 });
          Session.findOneAndUpdate({user:user_data.user},{token:token}).exec(function(err,session){
            console.log("session",session);
            Session.findOne({_id:session._id}).exec(function(err,session_data){
              return done(null, user,{
                sessionToken:session_data.token,
                sessionId:session_data._id
              }); 
            });
          });
        }
      });
    });
  }
);