/*
Load all models here
*/
var mongoose = require('mongoose');
var User = mongoose.model('User');
var session = require('session');
var config = require('config');

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
Empty HTTP method object.
*/

var methods = {};

/*
Routings/controller goes here
*/
module.exports.controller = function(router) {
		router
			.route('/dashboard').all(session.checkToken)
			.get(methods.dashboard);

		router.route('/paypal_webhook').all(session.checkToken)
			.post(methods.paypal_webhook);		

		
}

/**************************************************************************************************************************/
/***************************************** All the HTTP methods goes here *************************************************/
/**************************************************************************************************************************/
methods.dashboard = function(req,res){
	  resData = {
	  		userMessage : "OK",
	  		error: false,
	  		code: 0,
	  		data: null
	  	}
	  return res.status(200).json(req.user);
};

methods.paypal_webhook = function(req,res){
	console.log(req.body);
	console.log(req.query);
	res.send(200);
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
			        "line1": "StayBr111idge Suites",
			        "line2": "Cro12ok Street",
			        "city": "San Jose",
			        "state": "CA",
			        "postal_code": "95112",
			        "country_code": "US"
			    }
			};
			paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {

				if (error) {
                    console.log(error);
                    throw error;
                } else {
                    console.log("Create Billing Agreement Response");
                    console.log(billingAgreement);
                    for (var index = 0; index < billingAgreement.links.length; index++) {
                        if (billingAgreement.links[index].rel === 'approval_url') {
                            var approval_url = billingAgreement.links[index].href;
                            res.redirect(approval_url);

                            //console.log("Payment token is");
                            //console.log(url.parse(approval_url, true).query.token);
                            // See billing_agreements/execute.js to see example for executing agreement 
                            // after you have payment token
                        }
                    }
                }

			});
		}
	});

}


methods.createListing = function(req,res){
	req.assert('title', 'required').notEmpty();
	

	var errors = req.validationErrors();
	var mappedErrors = req.validationErrors(true);
};