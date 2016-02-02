var voip = {};


voip.makeCall = function(to,callback){
	// Twilio Credentials
	console.log("111"); 
	var accountSid = 'AC41380ad3f19ff53841b1ba46dd89c755'; 
	var authToken = 'b4b82dc639c97907027f827ac3c01654'; 

	//require the Twilio module and create a REST client 
	var client = require('twilio')(accountSid, authToken);

	//Place a phone call, and respond with TwiML instructions from the given URL
	client.makeCall({
	    to: "+"+to, 
	    from: "+17738400428", 
	    url: 'http://128.199.106.227:9000',   
	}, function(err, message) { 
		if(err)
			console.log("error",err);
		else{
	   		console.log("made call to your number"); 
	   		setTimeout(function(){
            	client.calls(message.sid).get(function(err, call) {
                	console.log("status",call.status);
                	callback(call.status);
            	})
        	},60000);
		}
	});
};


module.exports = voip;