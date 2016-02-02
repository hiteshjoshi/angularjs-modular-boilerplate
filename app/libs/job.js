var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var Reminder = mongoose.model('Reminder');
var User = mongoose.model('User');
var async = require('async');
var _= require('lodash');
var request = require('request');
var mail = require('mail');
var voip = require('voip');
var createVoip = require('createVoip');

var m = {};

m._findAttendees = function(reminder,callback){
	//find reminder details
	//add reminder for every user, based on their timezone
	Reminder
	.findOne({_id:reminder._id})
	.populate('user')
	.lean()
	.exec(function(err,reminder){
		console.log(err,reminder,"HEREIAMBOLLSDFDSF");
		var attendee = reminder.user._id;
		callback(required_attendee,reminder);
/*
		async.mapSeries(reminder.user.care_giver,function(care_giver,cb){
			if(_.include(attendees,String(care_giver._id))){
				console.log(care_giver);
				cb(false,care_giver);
			}
			else{
				cb(false,null);
			}
		},
		function(err,required_attendees){
			callback(required_attendees,reminder);
		});*/
	});
};

m._Timezone = {
	"eastern":"America/New_York",
	"central":"America/Chicago",
	"mountain":"America/Denver",
	"pacific":"America/Los_Angeles",
	"alaska":"America/Los_Angeles",
	"hawaii":"America/Los_Angeles"
}
console.log("timezone",m._Timezone);

m._reassurance = function(recipient,user,reason,callback){
	User.findOne({_id:recipient._id})
	.exec(function(err,recipient){
		User.findOne({_id:user})
		.exec(function(err,user){
			createVoip.makevoip(user.firstName+' '+user.lastName+'has not picked their call for reminder of '+reason+' . Can you please check ?');
			voip.makeCall(recipient.mobile,callback);
		});		
	});
}

m._nonreassurance = function(recipient,user,reason,callback){
	User.findOne({_id:recipient._id})
	.exec(function(err,recipient){
		User.findOne({_id:user})
		.exec(function(err,user){
			createVoip.makevoip(user.firstName+' '+user.lastName+'has there reminder for '+reason);
			voip.makeCall(recipient.mobile,callback);
		});	
	});
}

m._sendText = function(msg,number,callback){
	sms.sendSMS(number,msg);
}

m._callNumber = function(numberToCall,details,callback){
	var status='';
	var num_of_reassurance=0;
	while((String(status)!=='completed')||(num_of_reassurance<=details.reassurance_attempts)){
		createVoip.makevoip("It is time for"+details.title);
		status=voip.makeCall(numberToCall,callback);
		num_of_reassurance+=1;
	}
	if(num_of_reassurance>reassurance){
		Reminder.findOneAndUpdate({_id:details._id},{alert:true}).lean().exec(function(err,reminder){
			_.each(details.reassurance_recipients,function(recipient){
				m._reassurance(recipient,reminder.user,details.title,function(success){

				});
			});
		});
	}
}

m._sendEmail = function(email,reminder_details,callback){
	mail.sendMail(email,"Reminder from CareToCall.com",reminder_details,"no-reply@caretocall.com")
}

m._addReminder = function(cron,details,attendee,callback){
	console.log("attendee",attendee);
	try{
		new CronJob(cron,
			function(){
				if(details.notify_by.text){
				//send text
					User.findOne({_id:attendee})
					.exec(function(err,user){
						m._sendText(details.text_sms,user.mobile,function(success){

						});
					});
				}
				
				if(details.notify_by.voice){
				//call
					User.findOne({_id:attendee})
					.exec(function(err,user){
						var numberToCall = user.preferred_number==1?user.mobile:user.landline;
						var cb=m._callNumber(numberToCall,details,function(success){
							if(!details.reassurance_reminder&&details.reassurance_recipients.length>0){
								Reminder.findOne({_id:details._id}).lean().exec(function(err,reminder){
									_.each(details.reassurance_recipients,function(recipient){
										m._nonreassurance(recipient,reminder.user,details.title,function(success){

										});
									});
								});
							}
						});
					});
				}
				if(details.notify_by.email){
				//send email
					User.findOne({_id:attendee})
					.exec(function(err,user){
						m._sendEmail(user.email,details.email);
					});
				}
			},
			function(){},
			true,
			attendee.timezone
		);
	}
	catch(ex) {
    	console.log("cron pattern not valid");
	}
};
var Job = {
	startWeekly:function(reminder,scheduled){
		var time = new Date(scheduled);
		var day = time.getDay();
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var cronFormat = "00 "+minutes+" "+hours+" * * "+day;

		m._findAttendees(reminder,function(attendee,reminder_details){
			m._addReminder(cronFormat,reminder_details,attendee,function(success){
				console.log("Reminder added? : ",success);
			})
		});

	},
	startMonthly:function(reminder,scheduled){
		var time = new Date(scheduled);
		var date = time.getDate();
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var cronFormat = "00 "+minutes+" "+hours+" "+date+" 0-11 *";

		m._findAttendees(reminder,function(attendee,reminder_details){
			m._addReminder(cronFormat,reminder_details,attendee,function(success){
				console.log("Reminder added? : ",success);
			})
		});
	},
	startDaily:function(reminder,scheduled){
		var time = new Date(scheduled);
		var date = time.getDate();
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var cronFormat = "00 "+minutes+" "+hours+" * * 0-6";

		m._findAttendees(reminder,function(attendee,reminder_details){
			m._addReminder(cronFormat,reminder_details,attendee,function(success){
				console.log("Reminder added? : ",success);
			})
		});
	},
	oneTime:function(reminder,scheduled){
		console.log("ADDING SINELG",reminder,scheduled);
		m._findAttendees(reminder,function(attendees,reminder_details){
			_.each(attendees,function(attendee,index){
				m._addReminder((new Date(scheduled)),reminder_details,attendee,function(success){
					console.log("Reminder added? : ",success);
				})
			});
		});
	}
}

module.exports = {
	job : Job
}