var sms = {};


sms.sendSMS = function(to,body){
	// Twilio Credentials
	console.log("111"); 
	var accountSid = 'AC41380ad3f19ff53841b1ba46dd89c755'; 
	var authToken = 'b4b82dc639c97907027f827ac3c01654'; 

	//require the Twilio module and create a REST client 
	var client = require('twilio')(accountSid, authToken);


	client.messages.create({ 
    	to: "+"+to, 
    	from: "+17738400428", 
    	body: body,   
	}, function(err, message) { 
		if(err)
			console.log("error",err);
		else
    		console.log("message sent to your number"); 
	});
};


module.exports = sms;