var mongoose = require('mongoose');
var resData = {
	error:false,
	code:"",
	data:null,
	userMessage:''
};
module.exports.controller = function(router) {
	router.get('/', function(req, res) {
		resData.userMessage = 'Horray! We are coming, this new year!!';
		resData.data = 'Horray! We are coming, this new year!!';
		res.json(resData);	
	});

	

	router.all('/email_parsing',function(req,res){
		console.log(req.headers,req.body);
		res.send(200)
	});

}