var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var Reminder = mongoose.model('Reminder');
var User = mongoose.model('User');
var async = require('async');
var _ = require('lodash');
var request = require('request');
var mail = require('mail');

var m = {};

m._findAttendees = function(reminder,callback){
	//find reminder details
	//add reminder for every user, based on their timezone
	Reminder
	.findOne({_id:reminder})
	.populate('user')
	.lean()
	.exec(function(err,reminder){
		console.log(err,reminder,"HEREIAMBOLLSDFDSF");
		var attendees = reminder.recipients

		async.mapSeries(reminder.user.care_giver,
			function(care_giver,cb){
				if(_.includes(attendees,String(care_giver._id))){
					cb(false,care_giver);
				}
				else{
					cb(false,null);
				}
			},
			function(err,required_attendees){
				callback(required_attendees,reminder);
			});
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


m._sendText = function(msg,number,callback){
	request.post(
		{
			url:'https://app.grouptexting.com/sending/messages?format=json',
			form: {
				User:'C2Cgroup',
				Password:'derham2014',
				Message:msg,
				PhoneNumbers:number
			}
		},
		function(err,httpResponse,body){
			if(err)
				callback(false);
			else
			{
				var response = JSON.parse(body);
				if (response.Response.Code == 201){
					callback(true);
				}
				else{
					callback(false);
				}
			}

		}
		);
}

m._callNumber = function(){

}

m._sendEmail = function(user, reminder_details,callback){

	mail.sendMail(user.email_address,"Reminder from CareToCall.com",reminder_details.email,"no-reply@caretocall.com")
}

m._addReminder = function(cron,details,attendee,callback){
	new CronJob(cron,
		function(){

			if(details.notify_by.text)
			//send text
			m._sendText(details.text_sms,attendee.mobile,function(success){

			});

			if(details.notify_by.voice)
			//call
			var numberToCall = details.preferred_number==1?details.mobile:details.landline;
			m._callNumber(user,numberToCall,function(success){

			});

			if(details.notify_by.email)
			//send email
			m._sendEmail(attendee,details);
		},
		function(){},
		true,
		m._Timezone(attendee.timezone)
	);
};
var Job = {
	startWeekly:function(reminder,scheduled){
		var time = new Date(scheduled);
		var day = time.getDay();
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var cronFormat = "00 "+minutes+" "+hours+" * * "+day;

		m._findAttendees(reminder,function(attendees,reminder_details){
			_.each(attendees,function(attendee,index){
				m._addReminder(cronFormat,reminder_details,attendee,function(success){
					console.log("Reminder added? : ",success);
				})
			});
		});

	},
	startMonthly:function(reminder,scheduled){
		var time = new Date(scheduled);
		var date = time.getDate();
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var cronFormat = "00 "+minutes+" "+hours+" "+date+" 0-11 *";

		m._findAttendees(reminder,function(attendees,reminder_details){
			_.each(attendees,function(attendee,index){
				m._addReminder(cronFormat,reminder_details,attendee,function(success){
					console.log("Reminder added? : ",success);
				})
			});
		});
	},
	startDaily:function(reminder,scheduled){
		var time = new Date(scheduled);
		var date = time.getDate();
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var cronFormat = "00 "+minutes+" "+hours+" * * 0-6";

		m._findAttendees(reminder,function(attendees,reminder_details){
			_.each(attendees,function(attendee,index){
				m._addReminder(cronFormat,reminder_details,attendee,function(success){
					console.log("Reminder added? : ",success);
				})
			});
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