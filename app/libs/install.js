
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Admin = mongoose.model('User');
var Plan = mongoose.model('Plan');
var log = console.log;
module.exports = function(app,callback){

var planId = null;

Plan.findOne({paypalId:'P-4GX207377T9451908IQEYLUI'}).exec(function(err,plan){
  if(!plan){
    var newPlan = new Plan({
      paypalId: 'P-4GX207377T9451908IQEYLUI',
      active: true,
      plan_type: 1,
      users: 0,
      price: '20',
      members: 10,
      reminder: { voice: 10, emails: 10 },
      description: 'asdf',
      name: 'This is amazing new plan',
    });
    newPlan.save();
    planId = newPlan._id;
  }
})
  

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
        firstName : "Admin",
        lastName : "user",
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