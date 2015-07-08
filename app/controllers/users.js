/*
Load all models here
*/
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Invite = mongoose.model('Invite');
var Session = mongoose.model('Session');
var Reminder = mongoose.model('Reminder');
var PlanUsage = mongoose.model('PlanUsage');
var Plan = mongoose.model('Plan');
var config = require('config');
var jwt = require('jsonwebtoken');
var uuid = require('node-uuid');
var session = require('session');
var mail = require('mail');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var async = require('async');
var paypal = require('paypal-rest-sdk');
	paypal.configure(config.paypal);

/* the response object for API
	error : true / false
	code : contains any error code
	data : the object or array for data
	userMessage : the message for user, if any.
*/

var response = {
	error:false,
	code:"",
	data:null,
	userMessage:'',
	errors:null
};

var NullResponseValue = function () {
  response = {
    error:false,
    code:"",
    data:null,
    userMessage:'',
    errors:null
  };
  return true;
};
var SendResponse = function (res) {
  res.send(response);
  NullResponseValue();
};

var passport = require('passport');
/*
Routings/controller goes here
*/
module.exports.controller = function(router) {



	// --------- ADMIN --------- //
	router.route('/admin/users')
		.post(session.checkToken,methods.checkAdmin,methods.createAdmin)
		.get(session.checkToken,methods.checkAdmin,methods.getUsers);

	router.route('/admin/plans')
		.post(session.checkToken,methods.checkAdmin,methods.createPlans)
		.get(session.checkToken,methods.checkAdmin,methods.getAdminPlans);

	router.route('/admin/plans/:plan_id')
		.put(session.checkToken,methods.updatePlans); //this just makes it active or inactive.

	router.route('/admin/plans/paypal')
		//.put(session.checkToken,methods.updatePaypal)
		.post(session.checkToken,methods.checkAdmin,methods.createPaypal)
		.get(session.checkToken,methods.checkAdmin,methods.getPaypal);


	router.route('/users')
		.post(methods.createUser)

	router.route('/users/:user_id')
		.get(session.checkToken,methods.getUserProfile)
		.put(session.checkToken,methods.updateUser)

	router.route('/users/:user_id/billing')
		.get(session.checkToken,methods.getUserbilling)

	router.route('/users/confirm')
		.post(methods.confirmEmail)

	router.route('/ping')
		.get(session.checkToken,methods.getUser)

	router.route('/users/login')
		.post(methods.userLogin)
	router.route('/users/logout')
		  .post(session.checkToken,methods.logout);

	router.route('/users/forgot_password')
		.post(methods.forgotPassword)

	router.route('/users/create_password')
		.post(methods.createPassword)

	router.route('/invite')
		.post(session.checkToken,methods.inviteUser)


	router.route('/users/:user_id/networks')
		.get(session.checkToken,methods.getNetwork)
		.post(session.checkToken,methods.addNetwork)

	router.route('/users/:user_id/networks/:member_id')
		.delete(session.checkToken,methods.removeNetwork)
		.put(session.checkToken,methods.updateNetwork)

	router.route('/reminders')
		.get(session.checkToken,methods.getReminders)
		.post(session.checkToken,methods.addReminder);

	router.route('/reminders/:reminderId')
		//.put(session.checkToken,methods.updateReminder)
		.delete(session.checkToken,methods.deleteReminder);

	router.route('/billing/paypal/subscribe')
		.post(session.checkToken,methods.paypalSubscribe);


	router.route('/plans')
			.get(methods.getPlans);

	router.route('/paypal/payments')
			.get(methods.confirmPaypalSubscription);



	router.param('reminderId', function (req, res, next, id) {
		//@TODO : Add mongoose _id regex validation.
	  Reminder.findOne({_id:id}).lean().exec(function(err,reminder){

	  	if(err){
	  	  response.error = true;
	  	  response.code = 10901;
	  	  response.userMessage = 'There was a problem with the request, please try again.'
	  	  return (SendResponse(res));
	  	}
	  	else{
	  		
  			req.reminder = reminder;
  			return next();
  		
	  	}

	  });

	});

	router.param('user_id', function (req, res, next, id) {
		//@TODO : Add mongoose _id regex validation.
	  User.findOne({_id:id}).lean().exec(function(err,user){

	  	if(err){
	  	  response.error = true;
	  	  response.code = 10901;
	  	  response.userMessage = 'There was a problem with the request, please try again.'
	  	  return (SendResponse(res));
	  	}
	  	else{
  			req.profile = user;
  			return next();
	  	}

	  });

	});


	router.param('plan_id', function (req, res, next, id) {
		//@TODO : Add mongoose _id regex validation.
	  Plan.findOne({_id:id}).lean().exec(function(err,plan){

	  	if(err){
	  	  response.error = true;
	  	  response.code = 10901;
	  	  response.userMessage = 'There was a problem with the request, please try again.'
	  	  return (SendResponse(res));
	  	}
	  	else{
  			req.plan = plan;
  			return next();
	  	}

	  });

	});


	router.param('member_id', function (req, res, next, id) {
		
		//@TODO : Add mongoose _id regex validation.
	  User.findOne({_id:req.profile._id,'care_giver._id':id}).lean().exec(function(err,user){

	  	if(err){
	  	  response.error = true;
	  	  response.code = 10901;
	  	  response.userMessage = 'There was a problem with the request, please try again.'
	  	  return (SendResponse(res));
	  	}
	  	else{
	  		if(!user){
	  			response.error = true;
	  			response.userMessage = 'Network user not found.'
	  			return (SendResponse(res));
	  		}
	  		else{
	  			req.network_user = user;
	  			req.network_id = id;
  				return next();	
	  		}
  			
	  	}

	  });

	});



};


/*
Empty HTTP method object.
*/
var methods = {};

methods.checkAdmin = function(req,res,next){
		if(!req.user.is_admin)
			return res.send(401);
		else
			next();
}


/*===========================================
***   Payment confirmation for paypal  ***
=============================================*/

methods.confirmPaypalSubscription = function(req,res){
	//console.log(req.body,req.query);
	var paymentToken = req.query.token;

	paypal.billingAgreement.execute(paymentToken, {}, function (error, billingAgreement) {
	    if (error) {
	    	response.userMessage = 'Error using paypal payments';
	    	response.error = true;
	        return SendResponse(res);
	    } else {
	        console.log("Billing Agreement Execute Response");
	        console.log(JSON.stringify(billingAgreement));
	        response.data = billingAgreement
	        return SendResponse(res);
	    }
	});
};

/*-----  End of confirmPaypalSubscription  ------*/


/*========================================
***   Get user billing information  ***
==========================================*/

methods.getUserbilling = function(req,res){
	PlanUsage
	.findOne({user_id:req.user._id})
	.populate('plan_id','paypalId price paid members name processed')
	.populate('user_id','firstName mobile landline preferred_number lastName email_verified name email billing_details')
	.lean()
	.exec(function(err,plan){
		if(err) {
			response.error = true;
			response.code = 10901;
			response.userMessage = 'There was a problem with the request, please try again'
			response.data = null;
			response.errors = null;
			return (SendResponse(res));
  		}
  		else{
  			response.data = {
  				user:req.user,
  				plan:plan
  			};
  			return (SendResponse(res));
  		}
	});
}

/*-----  End of getUserbilling  ------*/

/*========================================
***   Let user subscribe to paypal  ***
==========================================*/

methods.paypalSubscribe = function(req,res){

	PlanUsage
	.findOne({user_id:req.user._id})
	.populate('plan_id','name paypalId description')
	.exec(function(err,plan){
		if(plan.paid){
			response.userMessage = 'You are already subscribed';
			return (SendResponse(res));
		}
		else{
			var startDate = new Date();
			startDate = new Date(startDate.getTime() + 60*1000);

			function pad(n){return n<10 ? '0'+n : n}

			User.findOneAndUpdate({_id:req.user._id},{billing_details:req.body}).lean().exec();

			var billingAgreementAttributes = {
			    "name": "Agreement for "+ plan.plan_id.name,
			    "description": plan.plan_id.description,
			    "start_date": startDate.getUTCFullYear()+'-'
						      + pad(startDate.getUTCMonth()+1)+'-'
						      + pad(startDate.getUTCDate())+'T'
						      + pad(startDate.getUTCHours())+':'
						      + pad(startDate.getUTCMinutes())+':'
						      + pad(startDate.getUTCSeconds())+'Z',
			    "plan": {
			        "id": plan.plan_id.paypalId
			    },
			    "payer": {
			        "payment_method": "paypal"
			    },
			    "shipping_address": {
			        "line1": req.body.address_1,
			        "line2": req.body.address_2,
			        "city": req.body.city,
			        "state": req.body.state,
			        "postal_code": req.body.postal,
			        "country_code": req.body.country_code
			    }
			};
			paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
				console.log(error,billingAgreement,billingAgreementAttributes);
				if (error) {
                    //console.log(error.response.message);
                    //throw error;
                    response.error = true;
                    response.userMessage = error.response.message;
                    return (SendResponse(res));
                } else {
                    for (var index = 0; index < billingAgreement.links.length; index++) {
                        if (billingAgreement.links[index].rel === 'approval_url') {
                            var approval_url = billingAgreement.links[index].href;
                            //res.redirect(approval_url);

                            response.data = approval_url;
                            plan.processed = true;
                            plan.save();
                            return (SendResponse(res));
                        }
                    }
                }

			});
		}
	})

}

/*-----  End of paypalSubscribe  ------*/


/*======================================
***   User can delete reminders.  ***
========================================*/

methods.deleteReminder = function(req,res){
	
	if(String(req.reminder.user) !== String(req.user._id)){
		response.userMessage = "Not authorized";
		response.error = true;
		return (SendResponse(res));
	}
	else
	{
		Reminder.findOneAndRemove({_id:req.reminder._id}).exec();
		response.userMessage = "Reminder deleted";
		return (SendResponse(res));
	}
	
};

/*-----  End of deleteReminder  ------*/


/*===========================================
***   Get reminders that user created  ***
=============================================*/

methods.getReminders = function(req,res){
	var date = new Date();
	Reminder.find({user:req.user._id,schedule_date:{"$gte":date}})
	.sort('schedule_date')
	.lean()
	.exec(function(err,reminders){
		if(err) {
			response.error = true;
			response.code = 10901;
			response.userMessage = 'There was a problem with the request, please try again'
			response.data = null;
			response.errors = null;
			return (SendResponse(res));
  		}
  		else{
  			User.findOne({_id:req.user._id},{care_giver:1}).lean()
  			.exec(function(err,user){

  				var care_givers = {};
  				async.mapSeries(user.care_giver,

  					function(care_giver,cb){
  						care_givers[care_giver._id] = care_giver;
  						cb(false,care_giver);
  					},

  					function(err){

  						response.data = {reminders : reminders,network:care_givers || {}};
  						return (SendResponse(res));

  				});
  			});
  		}
	});
}

/*-----  End of getReminders  ------*/


/*========================================
***   When user will add reminders  ***
==========================================*/

methods.addReminder = function(req,res){
	//Check for POST request errors.
	req.checkBody('title', 'Title is required.').notEmpty();
	req.checkBody('recipients', 'Recipients are required.').notEmpty();
	req.checkBody('schedule_date', 'Schedule date is required.').notEmpty();
	//req.checkBody('schedule_time', 'Schedule time is required.').notEmpty();
	if(req.param('notify_by_voice'))
		req.checkBody('number_voice_recording','A valid 10 digits mobile number is required.').phone();
	if(req.param('notify_by_text'))
		req.checkBody('text_sms','A 255 character text message is required.').notEmpty();
	if(req.param('notify_by_email'))
		req.checkBody('email','Email message is required.').notEmpty();

	
	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}
	else{
		//Database functions here
		var reminder_fields = {
			user:req.user._id,
			title : req.param('title'),
			notify_by:{
				email:req.param('notify_by_email'),
				text:req.param('notify_by_text'),
				voice:req.param('notify_by_voice')
			},
			recipients:req.param('recipients'),
			text_sms : req.param('text_sms'),
			email : req.param('email'),
			number_voice_recording:req.param('number_voice_recording'),
			schedule_date : new Date(req.param('schedule_date')),
			recurring : req.param('recurring'),
			recurring_frequency : req.param('recurring_frequency')
		};

		var newReminder = new Reminder(reminder_fields);
		newReminder.save(function(err,reminder){
			if(err) {
				response.error = true;
				response.code = 10901;
				response.userMessage = 'There was a problem with the request, please try again'
				response.data = null;
				response.errors = null;
				return (SendResponse(res));
	  		}
	  		else{
	  			response.data = {
	  				reminder : reminder
	  			};
	  			response.userMessage = 'New reminder added.';
	  			return (SendResponse(res));
	  		}
		});
	}
}

/*-----  End of addReminder  ------*/


/*==========================================
***   Return care givers of the user  ***
============================================*/

methods.getNetwork = function(req,res){
	User.findOne({_id:req.user._id}).lean()
	.exec(function(err,user){
		if(err) {
			response.error = true;
			response.code = 10901;
			response.userMessage = 'There was a problem with the request, please try again'
			response.data = null;
			response.errors = null;
			return res.send(SendResponse(res));
  		}
  		else{
  			response.data = {
  				members : user.care_giver
  			};
  			return (SendResponse(res));
  		}		
	});
}

/*-----  End of getNetwork  ------*/

/*==============================================================
***   User adds people to their network, care_giver list  ***
================================================================*/

methods.addNetwork = function(req,res){
	//Check for POST request errors.

	req.checkBody('first_name','First name is required.').notEmpty();
	req.checkBody('last_name','Last name is required.').notEmpty();
	req.checkBody('landline','A valid 10 digits landline number is required.').phone().notEmpty();
	req.checkBody('mobile','A valid 10 digits mobile number is required.').phone().notEmpty();
	req.checkBody('timezone','Timezone is required.').notEmpty();
	req.checkBody('email_address','Eamil is required.').notEmpty();
	req.checkBody('preferred_number','Preferred number is required.').notEmpty();

	
	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}
	else{


		//Database functions here
		var newNetwork = {
			first_name : req.param('first_name'),
		    last_name : req.param('last_name'),
		    landline : req.param('landline'),
		    mobile : req.param('mobile'),
		    time_zone:req.param('timezone'),
		    email_address:req.param('email_address'),
		    preferred_number:req.param('preferred_number')//1 = mobile or 2= landline
		};
		PlanUsage.findOne({user_id:req.user._id}).populate('plan_id').populate('user_id','care_giver').lean()
		.exec(function(err,plandata){

			if(err) {
				response.error = true;
				response.code = 10901;
				response.userMessage = 'There was a problem with the request, please try again'
				response.data = null;
				response.errors = null;
				return (SendResponse(res));
	  		}
	  		else{

	  			var already_registered =false;

	  			async.mapSeries(plandata.user_id.care_giver,
	  				function(item,cb){
	  					if(item.email_address == req.param('email_address'))
	  						already_registered = true;
	  					cb(false,false);
	  				},

	  				function(err,results){
	  					if(already_registered){
			  				response.error = true;
							response.code = 10401;
							response.userMessage = 'Email already exists in your network';
							response.data = null;
							response.errors = {
								email:{
									msg : "Email address "+req.param('email_address')+" already exists in your network",
									param:"email"
								}
							};
							return (SendResponse(res));
			  			}
			  			else{

							if(plandata.members < plandata.plan_id.members) //if added members are less than allowed
							{
								User.findOneAndUpdate({_id:req.user._id},{$push:{care_giver:newNetwork}})
								.exec(function(err,data){
									
									if(err) {
										response.error = true;
										response.code = 10901;
										response.userMessage = 'There was a problem with the request, please try again'
										response.data = null;
										response.errors = null;
										return (SendResponse(res));
							  		}
							  		else{

							  			PlanUsage.findOneAndUpdate({user_id:req.user._id},{$inc:{members:1}})
							  			.populate('user_id','care_giver')
							  			.lean().exec(function(err,plandata){
											response.data = {
												members:plandata.user_id.care_giver,
												total:plandata.user_id.care_giver.length,
												allowed:plandata.plan_id.members
											};
											return (SendResponse(res));
										});
							  		}

								});
							}
							else
							{
								response.data = null;
								response.err = true;
								response.userMessage = 'You network is full. Please delete some or upgrade to higher plan';
								return (SendResponse(res));
							}
						}
	  				});
	  		}
		});
	}
}

/*-----  End of addNetwork  ------*/



/*====================================
***   Updating of user network  ***
======================================*/

methods.updateNetwork = function(req,res){

	req.checkBody('first_name','First name is required.').notEmpty();
	req.checkBody('last_name','Last name is required.').notEmpty();
	req.checkBody('landline','A valid 10 digits landline number is required.').phone().notEmpty();
	req.checkBody('mobile','A valid 10 digits mobile number is required.').phone().notEmpty();
	req.checkBody('timezone','Timezone is required.').notEmpty();
	req.checkBody('email_address','Eamil is required.').isEmail().notEmpty();
	req.checkBody('preferred_number','Preferred number is required.').notEmpty();

	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}

	else{
		User.findOneAndUpdate(
			{
				_id:req.user._id,
				'care_giver._id':req.network_id
			},
			{
				'care_giver.$.first_name' : req.param('first_name'),
				'care_giver.$.last_name' : req.param('last_name'),
				'care_giver.$.landline' : req.param('landline'),
				'care_giver.$.mobile' : req.param('mobile'),
				'care_giver.$.email_address' : req.param('email_address'),
				'care_giver.$.time_zone' : req.param('time_zone'),
				'care_giver.$.preferred_number' : req.param('preferred_number')
			})
		.exec(function(err,user){
			if(err) {
				response.error = true;
				response.code = 10901;
				response.userMessage = 'There was a problem with the request, please try again'
				response.data = null;
				response.errors = null;
				return res.send(SendResponse(res));
	  		}
	  		else{
	  			response.userMessage = 'User network updated';
	  			response.data = {
	  				members : user.care_giver
	  			}
	  			return res.send(SendResponse(res));
	  		}		
		})
	}

}

/*-----  End of updateNetwork  ------*/

/*===============================================
***   Remove a member from user's network  ***
=================================================*/

methods.removeNetwork = function(req,res){
	
	//Database functions here
	User.findOneAndUpdate({_id:req.user._id},{
		$pull:{care_giver:{_id:req.param('member_id')}}
	})
	.exec(function(err,data){
		console.log(data);

		PlanUsage.findOneAndUpdate({user_id:req.user._id},{members:data.care_giver.length}).lean()
		.exec(function(err,plandata){
			response.error = false;
			response.data = {
				members:data.care_giver,
				total:data.care_giver.length,
				allowed:plandata.members
			};
			return (SendResponse(res));
		});
	});

}

/*-----  End of removeNetwork  ------*/




// ============== ADMIN FUNCTIONS ===============//



/*=========================================
***   Show a user profile to a user  ***
===========================================*/

methods.getUserProfile = function(req,res){
	response.data = {
		profile : req.profile
	};
	return (SendResponse(res));
}

/*-----  End of getUserProfile  ------*/

/*======================
***   List users  ***
========================*/

methods.getUsers = function(req,res){
	User.find({

	})
	.populate('plan')
	.exec(function(err,users){
					if(err) {
						response.error = true;
						response.code = 10901;
						response.userMessage = 'There was a problem with the request, please try again'
						response.data = null;
						response.errors = null;
						return (SendResponse(res));
			  		}
			  		else{
			  			response.data = {users:users}
			  			return (SendResponse(res));
			  		}
	});
}

/*-----  End of getUsers  ------*/


/*================================================
***   This is when admin creates new users  ***
==================================================*/
methods.createAdmin = function(req,res){

	//Check for POST request errors.
	req.checkBody('email', 'Valid Email address is required.').notEmpty().isEmail();
	req.checkBody('password', 'Password is required, and should be between 8 to 80 haracters.').notEmpty().len(8, 80);

	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}
	else{
		//Database functions here
		var newUser = new User({
			firstName : req.body.first_name,
			lastName : req.body.last_name,
			email : req.param('email'),
			unique_code : uuid.v1(),
			password: req.param('password'),
			is_admin: true
		});

		newUser.save(function(err,user){

			if(err){
		        if(err.errors && ( err.errors.email != null || err.errors.email != undefined) ){
		          response.error = true;
		          response.code = 10902;
		          response.userMessage = 'Email already registered.';
		          response.errors = {
		            email : {
		              param : 'email',
		              msg : 'Email already registered',
		              value:req.body.email
		            }
		          };
		          return (SendResponse(res));
		        }
	        	else{
	        		console.log(err.errors);
	  			  response.error = true;
	  			  response.code = 10901;
	  			  response.userMessage = 'There was a problem with the request, please try again'
		          response.data = null;
		          response.errors = null;
	  			  return (SendResponse(res));
	  			}
			}
			else{

				response.error = false;
	            response.code = null;
				response.userMessage = 'Thank you for signing up! Please check your email for verification code and enter it here.';
				response.data = {user:user};
	            response.errors = null;
	            mail.sendMail(req.body.email,'Care to call Admin','This email is to verify you as admin, your verification code is '+user.unique_code,false);
				return (SendResponse(res));
			}


		});
	}
}

/*-----  End of createAdmin  ------*/

/*=====================================
***   New plans for the website  ***
=======================================*/

methods.createPlans = function(req,res){
	//Check for POST request errors.

	req.checkBody('name', 'Plan name is required').notEmpty();
	req.checkBody('description', 'Plan description is required').notEmpty();
	req.checkBody('emails', 'Number of emails are required.').notEmpty();
	req.checkBody('text', 'Number of texts are required.').notEmpty();
	req.checkBody('voice', 'Number of voice calls are required.').notEmpty();
	req.checkBody('members', 'Number of members are required').notEmpty();
	req.checkBody('price', 'Plan price is required').notEmpty();
	req.checkBody('plan_type', 'Plan type is required').notEmpty();
	//req.checkBody('paypalId', 'Paypal Id is required').notEmpty();

	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}
	else{
		//Database functions here
		var newPlan = new Plan({
			name: req.param('name'),
		  	description: req.param('description'),
		  	reminder: {
		  		emails : parseInt(req.param('emails')),
		  		text : parseInt(req.param('text')),
		  		voice : parseInt(req.param('voice'))
		  	},
		  	members : parseInt(req.param('members')),
		  	price: parseFloat(req.param('price')),
		  	plan_type : parseInt(req.param('plan_type')), //1 = monthly, 2 = yearly
		  	active : req.param('active')==='true' ? true:false,
		  	//paypalId : req.param('paypalId')
		});

		newPlan.save(function( err,plan){
			if(err) {
				response.error = true;
				response.code = 10901;
				response.userMessage = 'There was a problem with the request, please try again'
				response.data = null;
				response.errors = null;
				return (SendResponse(res));
	  		}
	  		else{
	  			response.data = {
	  				plan : plan
	  			};
	  			response.userMessage = 'Plan added successfully.';
	  			return (SendResponse(res));
	  		}
		});
	}
}

/*-----  End of createPlans  ------*/


/*=============================================================
***   Admin can activate and deactive plan through this  ***
===============================================================*/

methods.updatePlans = function(req,res){
	Plan.findOneAndUpdate({_id:req.plan._id},{active:!req.plan.active}).lean().exec();
	response.userMessage = req.plan.active?'Plan de-activated' : 'Plan activated';
	return (SendResponse(res));
}

/*-----  End of updatePlans  ------*/



/*============================================
***   Create payment methods at paypal  ***
==============================================*/

methods.createPaypal = function(req,res){
	//Check for POST request errors.
	req.checkBody('name', 'Paypal plan name is requird.').notEmpty();
	req.checkBody('description', 'Paypal plan description is requird.').notEmpty();
	req.checkBody('plan_id', 'Plan is requird.').notEmpty();
	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}
	else{
		//Database functions here

		Plan.findOne({_id:req.param('plan_id')}).lean()
		.exec(function(err,plan){

			if(err) {
				response.error = true;
				response.code = 10901;
				response.userMessage = 'There was a problem with the request, please try again'
				response.data = null;
				response.errors = null;
				return (SendResponse(res));
	  		}
	  		else{


	  			var billingPlanAttributes = {
				    "description": req.param('description'),
				    "merchant_preferences": {
				        "auto_bill_amount": "yes",
				        "cancel_url": "http://localhost:8000/#/paypalConfirm",
				        "initial_fail_amount_action": "continue",
				        "max_fail_attempts": "1",
				        "return_url": "http://localhost:8000/#/paypalCancel",
				        "setup_fee": {
				            "currency": "USD",
				            "value": "1"
				        }
				    },
				    "name": req.param('name'),
				    "payment_definitions": [
				        {
				            "amount": {
				                "currency": "USD",
				                "value": plan.price
				            },
				            "cycles": "0",
				            "frequency": plan.plan_type==1?"MONTH":"YEAR",
				            "frequency_interval": "1",
				            "name": req.param('name'),
				            "type": "REGULAR"
				        }
				    ],
				    "type": "INFINITE"
				};


				paypal.billingPlan.create(billingPlanAttributes,
					function (error, billingPlan) {
						console.log(error,billingPlan);
						if (error) {
					        response.error = true;
							response.userMessage = 'There was a problem with the paypal request, please try again'
							response.data = null;
							response.errors = null;
							return (SendResponse(res));
					    } else {
					        console.log(billingPlan.id);
					        Plan.findOneAndUpdate({_id:plan._id},{paypalId:billingPlan.id}).lean().exec();
					        var billing_plan_update_attributes = [
								    {
								        "op": "replace",
								        "path": "/",
								        "value": {
								            "state": "ACTIVE"
								        }
								    }
								];

							paypal.billingPlan.update(billingPlan.id, billing_plan_update_attributes, function (error, response) {
					            if (error) {
					                response.error = true;
									response.userMessage = 'There was a problem with the paypal request, please try again'
									response.data = null;
									response.errors = null;
									return (SendResponse(res));
					            } else {
					                paypal.billingPlan.get(billingPlan.id, function (error, billingPlan) {
					                    if (error) {
					                        response.error = true;
											response.userMessage = 'There was a problem with the paypal request, please try again'
											response.data = null;
											response.errors = null;
											return (SendResponse(res));
					                    } else {
					                    	response.data = {
					                        	paypal_details : billingPlan
					                        }
					                        response.userMessage = "Billing plan added to paypal";
					                        return (SendResponse(res));
					                    }
					                });
					            }
					        });
					    }
					});
	  		}
		});


	}
}

/*-----  End of createPaypal  ------*/


/*======================================
***   Get all the paypal records  ***
========================================*/

methods.getPaypal = function(req,res){

	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}
	else{
		//Database functions here
		Paypal.find({}).populate('plan').lean()
		.exec(function(err,paypal){

						if(err) {
							response.error = true;
							response.code = 10901;
							response.userMessage = 'There was a problem with the request, please try again'
							response.data = null;
							response.errors = null;
							return (SendResponse(res));
				  		}
				  		else{
				  			response.data = {paypal:paypal};
				  			return (SendResponse(res));
				  		}
		});
	}
}

/*-----  End of getPaypal  ------*/

// END of admin functions//



/*=================================================================
***   Just return the total plans with all the informations  ***
===================================================================*/

methods.getAdminPlans = function(req,res){

	Plan.find({}).lean()
	.exec(function(err,plans){
					if(err) {
						response.error = true;
						response.code = 10901;
						response.userMessage = 'There was a problem with the request, please try again'
						response.data = null;
						response.errors = null;
						return (SendResponse(res));
			  		}
			  		else{
			  			response.data =  {plans:plans}
			  			return (SendResponse(res));
			  		}
	})
}

/*-----  End of getAdminPlans  ------*/


/*********************
	When a user is invited to company.
*********************/
methods.inviteUser = function(req,res){

  req.checkBody('email', 'Valid Email address is required.').notEmpty().isEmail();
  req.checkBody('first_name', 'First name cannot be empty.').notEmpty();
  req.checkBody('last_name', 'Last name cannot be empty.').notEmpty();


  var errors = req.validationErrors(true);
  if(errors){
    response.error = true;
    response.code = 10801;
    response.errors = errors;
    return (SendResponse(res));
  }
  else{
    var password = uuid.v4();//random string.
    var invite_code = uuid.v1();
    var unique_code = uuid.v1();
    console.log(unique_code,invite_code);
    var newUser = new User({
      email:req.param('email'),
      first_name:req.param('first_name'),
      last_name:req.param('last_name'),
      password : password,
      invite_code : invite_code,
      unique_code : unique_code
    });
    newUser.save(function(err,user){

      if(err){
        response.error = true;
        response.code = 10901;
        response.userMessage = 'There was a problem with the request, please try again.'
        return (SendResponse(res));
      }
      else{
        // @TODO : Add this user to company.
        response.error = false;
        response.code = null;
        response.data = null;
        response.userMessage = "Thanks!";
        return (SendResponse(res));
      }


    });
  }
};



/*=========================================
***   Give user profile as response  ***
===========================================*/

methods.getUser = function(req,res){

	PlanUsage
	.findOne({user_id:req.user._id})
	.populate('plan_id','paypalId price paid members name processed')
	.populate('user_id','firstName lastName landline mobile preferred_number care_giver email_verified email billing_details')
	.lean()
	.exec(function(err,plan){
		if(err) {
			console.log(err);
			response.error = true;
			response.code = 10901;
			response.userMessage = 'There was a problem with the request, please try again'
			response.data = null;
			response.errors = null;
			return (SendResponse(res));
  		}
  		else{
  			response.data = {
  				user:req.user,
  				plan:plan
  			};
  			return (SendResponse(res));
  		}
	});
}

/*-----  End of getUser  ------*/

/*======================================================
***   User profile updation, billing details etc  ***
========================================================*/

methods.updateUser = function(req,res){
	//Check for POST request errors.
	req.checkBody('first_name', 'First name is required.').notEmpty();
	req.checkBody('last_name', 'First name is required.').notEmpty();
	req.checkBody('landline','A valid 10 digits landline number is required.').phone().notEmpty();
	req.checkBody('mobile','A valid 10 digits mobile number is required.').phone().notEmpty();
	req.checkBody('preferred_number', 'preferred number is required.').notEmpty();

	req.checkBody('address_1','Address is required.').notEmpty()
	req.checkBody('city','City is required.').notEmpty()
	req.checkBody('state','State is required.').notEmpty()
	req.checkBody('postal','Postal is required.').notEmpty()
	req.checkBody('country_code','Country is required.').notEmpty()
	req.checkBody('timezone','Timezone is required.').notEmpty()


	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}
	else{
		User.findOneAndUpdate({
			_id:req.user._id
		},{
			billing_details:{
				address_1:req.param('address_1'),
			    address_2:req.param('address_2'),
			    city:req.param('city'),
			    state:req.param('state'),
			    postal:req.param('postal'),
			    country_code:req.param('country_code'),
			    timezone:req.param('timezone')
			},
			firstName : req.param('first_name'),
			lastName : req.param('last_name'),
			landline : (req.param('landline')),
			mobile : (req.param('mobile')),
			preferred_number : parseInt(req.param('preferred_number'))
		})
		.exec(function(err,user){
			if(err) {
				response.error = true;
				response.code = 10901;
				response.userMessage = 'There was a problem with the request, please try again'
				response.data = null;
				response.errors = null;
				return (SendResponse(res));
	  		}
	  		else{
	  			response.userMessage = 'Profile updated.';
	  			return (SendResponse(res));
	  		}
		});
	}
}

/*-----  End of updateUser  ------*/


/********************
	Create new user profile and send verification email.
*********************/
methods.createUser = function(req,res){

	//Check for any errors.
	req.checkBody('email', 'Valid Email address is required.').notEmpty().isEmail();
	req.checkBody('password', 'Password is required, and should be between 8 to 80 haracters.').notEmpty().len(8, 80);
	req.checkBody('plan_id', 'Plan id cannot be empty.').notEmpty();

	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}
	else{

		var newUser = new User({
			email : req.param('email'),
			unique_code : uuid.v1(),
			password: req.param('password'),
			plan : req.param('plan_id')
		});

		newUser.save(function(err,user){

			if(err){
		        if(err.errors && ( err.errors.email != null || err.errors.email != undefined) ){
		          response.error = true;
		          response.code = 10902;
		          response.userMessage = 'Email already registered.';
		          response.errors = {
		            email : {
		              param : 'email',
		              msg : 'Email already registered',
		              value:req.body.email
		            }
		          };
		          return (SendResponse(res));
		        }
	        	else{
	        		console.log(err.errors);
	  			  response.error = true;
	  			  response.code = 10901;
	  			  response.userMessage = 'There was a problem with the request, please try again'
		          response.data = null;
		          response.errors = null;
	  			  return (SendResponse(res));
	  			}
			}
			else{

				var newPlan = new PlanUsage({
					user_id : user._id,
					plan_id : req.param('plan_id')
				});
				newPlan.save();

				response.error = false;
	            response.code = null;
				response.userMessage = 'Thank you for signing up! Please check your email for verification code and enter it here.';
				response.data = null;
	            response.errors = null;
	            mail.sendMail(req.body.email,'Care to call Validation email','verification code : '+user.unique_code,false);
				return (SendResponse(res));
			}


		});
	}
};

/********************
	Create new user profile and send verification email.
*********************/
methods.confirmEmail = function(req,res){

	//Check for any errors.
	req.checkBody('validation_code', 'Validation code is required.').notEmpty();

	var errors = req.validationErrors(true);
	if(errors){
		response.error = true;
		response.code = 10801;
		response.errors = errors;
	    response.userMessage = 'Validation errors';
	    return (SendResponse(res));
	}
	else{

		User.findOne(
			{
				unique_code:req.param('validation_code')
			}
		)
		.exec(function (err,user){
			if(err) {
				response.error = true;
				response.code = 10901;
				response.userMessage = 'There was a problem with the request, please try again'
				response.data = null;
				response.errors = null;
				return (SendResponse(res));
	  		}
	  		else {

	  			if(user){

	  				if (user.email_verified) {
	  					response.userMessage = 'Email already verified. Please login.'
	  					response.error = true;
		  				response.errors = [{
		  					msg : 'Email already verified. Please login.'
		  				}];
		  				return (SendResponse(res));
	  				}
	  				else{
	  					user.email_verified = true;
	  					user.save();
	  					//create session here.
						var token = jwt.sign({_id:String(user._id),firstName:user.firstName,lastName:user.lastName,email:user.email,is_admin:user.is_admin},config.sessionSecret,{ expiresInMinutes: 60*120 });
						var newSession = new Session({
							user : user._id,
							token:token
						});
						newSession.save();
						response.error = false;
						response.code = null;
						response.userMessage = 'Thank you for logging in. Taking you to dashboard now.';
						response.data = {
							token : newSession.token
						};
						response.errors = null;
						return (SendResponse(res));
	  				}


	  			}
	  			else{
	  				response.error = true;
	  				response.errors = [{
	  					msg : 'Invalid code!'
	  				}];
	  				return (SendResponse(res));
	  			}


	  		}
		});
	}
};

/***************************************
  Create user login and send session info
***************************************/
methods.userLogin = function(req,res,next){

  //Check for any errors.
  req.checkBody('email', 'Valid Email address is required.').notEmpty().isEmail();
  req.checkBody('password', 'Password is required, and should be between 8 to 80 haracters.').notEmpty().len(8, 80);

  var errors = req.validationErrors(true);
  if(errors){
    response.error = true;
    response.errors = errors;
    response.userMessage= 'Validation errors';
    response.data = null;
    response.code = 10801;
    return (SendResponse(res));
  }
  else{
	  	passport.authenticate('local',function(err,user,info){

 			if(err){
 				response.error = true;
				response.code = 10901;
				response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
				response.data = null;
				response.errors = null;
 			  	return (SendResponse(res));
 			}
 			else{
		        if(!user){
		          response.error = true;
		          response.code = 10101; //user Doenst exists
		          response.data = null;
		          response.userMessage = 'User doesn\'t exits';
		          response.errors = {
		            user : 'User does not exists!'
		          }
		          return res.status(401).send(SendResponse(res));
        		}
		        else{
		          response.error = false;
		          response.code = null;
		          response.userMessage = 'Thanks for logging in.';
		          response.data = {
		            token : info.sessionToken
		          }
		          response.errors = null;
		          return (SendResponse(res));
		        }
 			}
	  	})(req, res, next);
  }
};

/***************************************
  userLogin ends
***************************************/


/***************************************
  Send new password for user to login.
***************************************/
methods.forgotPassword = function(req,res){

  //Check for any errors.
  req.checkBody('email', 'Valid Email address is required.').notEmpty().isEmail();

  var errors = req.validationErrors(true);
  if(errors){
    response.error = true;
    response.errors = errors;
    response.code = 10801;
    return (SendResponse(res));
  }
  else{
    User.findOneAndUpdate({email:req.param('email')},{token:uuid.v1()}).lean()
    .exec(function(err,user){

    	if(err){
    	  response.error = true;
    	  response.code = 10901;
    	  response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
    	  return (SendResponse(res));
    	}
    	else{
    		if(!user){
    			response.error = true;
    			response.code = 10802;
          response.data = null;
    			response.userMessage = 'This email is not registered with us. May be you want to create a new account? Or just call customer support.';
    			return (SendResponse(res));
    		}
    		else{
          response.error = false;
          response.code = null;
    			response.userMessage = user.token;
          response.data = null;
    			return (SendResponse(res));
    		}
    	}

    });
  }
};

/***************************************
  forgotPassword ends
***************************************/




/**********************************************************************
  User can create new password form the unique code sent in his email
**********************************************************************/
methods.createPassword = function(req,res){

  //Check for any errors.
  req.checkBody('unique_code', 'The unique code is missing!').notEmpty();
  req.checkBody('email', 'Valid Email address is required.').notEmpty().isEmail();
  req.checkBody('password', 'Password is required, and should be between 8 to 80 haracters.').notEmpty().len(8, 80);
  req.checkBody('confirm_password', 'Confirm password is required, and should be same as password.').notEmpty().equals('password');

  var errors = req.validationErrors(true);
  if(errors){
    response.error = true;
    response.errors = errors;
    response.code = 10801;
    return (SendResponse(res));
  }
  else{
    User.findOne({email:req.param('email'),unique_code:req.param('unique_code')})
    .exec(function(err,user){

    	if(err){
    	  response.error = true;
    	  response.code = 10901;
    	  response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
    	  return (SendResponse(res));
    	}
    	else{
    	  if(!user){
    			response.error = true;
    			response.code = 10802;
    			response.userMessage = 'Invalid token or this email address is not registered with us. Call customer support for further help.';
    			return (SendResponse(res));
    		}
    		else{
    			user.password = req.param('password');
    			user.save(function(err,user){

    				if(err){
    				  response.error = true;
    				  response.code = 10901;
    				  response.userMessage = 'Oops! Our bad! The server slept while doing that, we just poured it with some coffee. Can you please try doing it again?'
    				  return (SendResponse(res));
    				}
    				else{
              response.error = false;
              response.code = null;
              response.data = null;
    				  response.userMessage = 'Awesome! You may now login with your new credentials.'
    				  return (SendResponse(res));
    				}

    			});
    		}
    	}

    });
  }
};

/**********************************************************************
  createPassword ends
**********************************************************************/



methods.logout = function(req,res){
	Session.findOneAndRemove({user:req.user._id}).exec();
	res.send(200);
}

/*========================================================
***   Public function to give all the active plans  ***
==========================================================*/

methods.getPlans = function(req,res){
	Plan.find({active:true}).lean()
	.exec(function(err,plans){
		response.data = {plans:plans};
		return SendResponse(res);
	});
}

/*-----  End of getPlans  ------*/
