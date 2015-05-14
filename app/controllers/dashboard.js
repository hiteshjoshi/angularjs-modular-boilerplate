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

		router.route('/listing').all(session.checkToken)
			.post(methods.createListing);

		
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


methods.createListing = function(req,res){
	req.assert('title', 'required').notEmpty();
	

	var errors = req.validationErrors();
	var mappedErrors = req.validationErrors(true);
};