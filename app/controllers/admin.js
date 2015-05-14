//All the SUPER ADMIN things for askparrot, like creating first person account of a company.

/*
Load all models here
*/
var mongoose = require('mongoose');
var User = mongoose.model('User');
var session = require('session');

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
	router.route('/master/users')
		.all(session.masterToken)
		.post(methods.createUser)
		.post(methods.createCompany)
		
	//isolate this method from checking token
	router.route('/master')
		.post(methods.login);
}

/**************************************************************************************************************************/
/***************************************** All the HTTP methods goes here *************************************************/
/**************************************************************************************************************************/

//Sacred master login
methods.login = function(req,res){
	if(req.body.user == 'hitesh' && req.body.pass == 'hitesh'){
		resData.data = {
			token : session.newMasterSession()
		};
		res.json(resData);
	}
	else
		res.send(403);
};

//Create Company API
methods.createCompany = function(req,res){
	res.send(200);
};
methods.createUser = function(req,res){
	res.send(200);
};

