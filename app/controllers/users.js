/*
Load all models here
*/
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Plan = mongoose.model('Plan');
var Session = mongoose.model('Session');
var PlanUsage = mongoose.model('PlanUsage');
var config = require('config');
var session = require('session');
var jwt = require('jsonwebtoken');
var utils = require('utils')
var paypal = require('paypal-rest-sdk');
paypal.configure(config.paypal);

/* the response object for API
	error : true / false 
	code : contains any error code
	data : the object or array for data
	userMessage : the message for user, if any.
*/
var resData = {
	error:false,
	code:"",
	data:null,
	userMessage:''
};

/*
Routings/controller goes here
*/
module.exports.controller = function(router,passport) {

	// router.route('session').get(function(req,res,next){

	// });

	router.route('/login')
		  .post(function(req,res,next){
		  	passport.authenticate('local',function(err,user,info){
		  		if(err){
	 					
	 					throw err;
	 			}

	 			PlanUsage.findOne({user_id:user._id}).populate('plan_id').lean().exec(function(err,plans){
	 				//res.cookie('costartsession',info.sessionToken , {domain: config.cookieDomain, path: '/'});
			  		resData.error = false;
			  		resData.data = {
			  			token :info.sessionToken,
						plan:newPlan
					}
					resData.userMessage = "Thank you! Please wait while we take you to your dashboard...";
					res.send(resData);
	 			});
		  	})
		  });
	
	router.route('/signup')
		  .post(methods.signup);

	router.route('/plans')
		  .get(methods.plans);	

	// router.route('/auth/facebook')
	// 	.get(passport.authenticate('facebook',{ scope: config.facebook.scope }));
	
	// router.route('/auth/facebook/callback')
	// 	.get(function(req,res,next){
	// 			passport.authenticate('facebook', function(err, user, info) {
	// 				if(err){
	// 					res.redirect(config.baseUrl+'server_error');
	// 					throw err;
	// 				}
	// 				else
	// 				{	
	// 					res.cookie('costartsession',info.sessionToken , {domain: config.cookieDomain, path: '/', maxAge:  60*5*60*1000 });
	// 					res.redirect(config.baseUrl);
	// 				}
	// 			})(req, res, next);
	// 	});


	router.route('/profile').all(session.checkToken).get(methods.profile);
	router.route('/user/pay').all(session.checkToken).put(methods.pay);
	router.route('/user/network').all(session.checkToken).get(methods.userNetwork);
	router.route('/profile/:userId').get(methods.userProfile);

};

/*
Empty HTTP method object.
*/
var methods = {};

/**************************************************************************************************************************/
/***************************************** All the HTTP methods goes here *************************************************/
/**************************************************************************************************************************/

methods.signup = function(req,res){
	var user = new User(req.body);
		user.provider = 'local';
		user.save(function (err) {
		if (err) {
		    resData.error =true;
		    resData.data= {errors:utils.errors(err.errors)}
		    return res.send(resData);
		}

		else{

		      Plan.findOne({_id:req.body.plan})
		        .lean().exec(function(err,plan){

		          var joined = new Date();
		          if(plan.plan_type == 'monthly')
		            var plan_duration = 30*24*60*60*1000;
		          else
		            var plan_duration = 365*24*60*60*1000

		          var expiring = new Date ( parseInt( joined.getTime() + plan_duration ) );
		          if(plan.price == 0)
		            var paid = true
		          else
		            var paid = false

		          var newPlan = new PlanUsage({
		              user_id:user._id,
		              plan_id:req.body.plan,
		              joined : joined,
		              expiring : expiring,
		              reminder : {
		                emails : plan.reminder.emails,
		                text : plan.reminder.text,
		                voice: plan.reminder.voice
		              },
		              members : 0,
		              paid:paid
		          });
		          newPlan.save(function(err,np){
		          	var token = jwt.sign({name:user.name,email:user.email,is_admin:user.is_admin},config.sessionSecret,{ expiresInMinutes: 60*120 });
					var newSession = new Session({
						user : user._id,
						token:token
					});

					newSession.save(function(err,session){
						//res.cookie('s',"test" , {domain: config.cookieDomain, path: '/'});
						//res.cookie('costartsession',session.token , {domain: config.cookieDomain, path: '/'});
						resData.error = false;
						resData.data = {
							token :newSession.token,
							plan:newPlan
						}
						resData.userMessage = "Thank you! Please wait while we take you to your dashboard...";
						res.send(resData);
					});
		          });

		      }); //end plan.findone
		    }//end else




		})
};


methods.plans = function(req,res){
	Plan.find({active:true})
		.exec(function(err,plans){
			resData = {
		  		userMessage : "OK",
		  		error: false,
		  		code: 0,
		  		data: {plans:plans}
		  	}
		  return res.send(resData);
	});
};

methods.profile = function(req,res){
	PlanUsage
	.findOne({user_id:req.user._id})
	.populate('plan_id','paypalId price paid members name')
	.populate('user_id','firstName lastName email_verified name email billing_details')
	.lean()
	.exec(function(err,plan){
		console.log(plan,req.user);
		resData.data = plan;
		res.send(resData);
	});
	
};


methods.userProfile = function(req,res){
	User.findOne({_id:req.params.userId},{first_name:1,last_name:1,company:1,avatar:1,bio:1}).populate('company').lean()
		.exec(function(err,user){
			res.json(user);
		});
};


methods.pay = function(req,res){

	PlanUsage
	.findOne({user_id:req.user._id})
	.populate('plan_id','paypalId')
	.lean()
	.exec(function(err,plan){
		if(plan.paid){
			return res.redirect('/');
		}
		else{
			var startDate = new Date();
			startDate = new Date(startDate.getTime() + 60*1000);
			
			function pad(n){return n<10 ? '0'+n : n}

			User.findOneAndUpdate({_id:req.user._id},{billing_details:req.body}).lean().exec();

			var billingAgreementAttributes = {
			    "name": "Fast Speed Agreement",
			    "description": "Agreement for Fast Speed Plan",
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

				if (error) {
                    console.log(error.response.message);
                    //throw error;
                    resData.error = true;
                    resData.userMessage = error.response.message;
                    return res.send(resData);
                } else {
                    for (var index = 0; index < billingAgreement.links.length; index++) {
                        if (billingAgreement.links[index].rel === 'approval_url') {
                            var approval_url = billingAgreement.links[index].href;
                            //res.redirect(approval_url);
                            resData.data = approval_url
                            return res.send(resData);
                        }
                    }
                }

			});
		}
	})

	
}


methods.userNetwork = function(req,res){
	User.findone({_id:req.user_id}).lean().exec(function(err,data){
		resData.error = false;
		resData.data = data.care_giver;
		return res.send(resData);
	});
}