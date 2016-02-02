
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Admin = mongoose.model('User');
var Plan = mongoose.model('Plan');
var log = console.log;
module.exports = function(app,callback){




  //Check if we have someone as admin.
  Admin.findOne({is_admin:true}).exec(function(error,data){
    if(error)
      log("There is error with the database.")

    if(data){
      log("Atleast one admin exists......")
      console.log(data);
      callback(true);
    }
    else{
      log("No admin found.Will try to create a new one.")
      var newAdmin = new Admin({
        firstName : "Admin",
        lastName : "user",
        email: "me@hiteshjoshi.com",
        password : "@Hitesh@90",
        email_verified: true,
        is_admin:true
      })
      newAdmin.save(function(e,d){
        if(e)
          log("There is error with the database. Cannot create new admin user.")
        if(d){
          log("Created the new admin user.")
          callback(true);
        }
        else{
          log("Cannot create the new admin user.")
          callback(false);
        }
      });

    }
  })
}
