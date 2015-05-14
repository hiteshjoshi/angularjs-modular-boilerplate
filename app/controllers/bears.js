//Bear controller is just a template file for understanding the code.

/*
Load all models here
*/
var mongoose = require('mongoose');
var Bear = mongoose.model('Bear');

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

	//var mail = require('mail');
	router.route('/bears')
		.all(function(req,res,next){console.log("called");next()}) //add session middleware may be?
		.post(methods.createBear)
		.get(methods.getBears);
	router.route('/bears/:bear_id')
		.get(methods.getBear)
		.put(methods.updateBear)
		.delete(methods.deleteBear);
}

/**************************************************************************************************************************/
/***************************************** All the HTTP methods goes here *************************************************/
/**************************************************************************************************************************/


/********************************************** COPY ABOVE THIS LINE ******************************************************/
/**************************************************************************************************************************/
methods.createBear = function(req,res){
	var bear = new Bear();		// create a new instance of the Bear model
	bear.name = req.body.name;  // set the bears name (comes from the request)
	bear.save(function(err) {
		if (err)
			res.send(err);
		resData.userMessage = "Bear created!"
		res.json(resData);
	});
};


methods.getBears = function(req, res) {
	Bear.find(function(err, bears) {
		if (err)
			res.send(err);
		res.json(bears);
	});
}

methods.getBear = function(req, res) {
	Bear.findById(req.params.bear_id, function(err, bear) {
		if (err)
			res.send(err);
		res.json(bear);
	});
}


methods.updateBear = function(req, res) {
	Bear.findById(req.params.bear_id, function(err, bear) {

		if (err)
			res.send(err);

		bear.name = req.body.name;
		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bear updated!' });
		});

	});
}

methods.deleteBear = function(req, res) {
	Bear.remove({
		_id: req.params.bear_id
	}, function(err, bear) {
		if (err)
			res.send(err);

		res.json({ message: 'Successfully deleted' });
	});
}
