
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Admin = mongoose.model('User');
var log = console.log;
module.exports = function(app,callback){

  //Check if we have someone as admin.
  Admin.findOne({is_admin:true}).exec(function(error,data){
    if(error)
      log("There is error with the database.")

    if(data){
      log("Atleast one admin exists.")
      callback(true);
    }
    else{
      log("No admin found.Will try to create a new one.")
      var newAdmin = new Admin({
        name : "Admin user",
        email: "me@hiteshjoshi.com",
        password : "@Hitesh@90",
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