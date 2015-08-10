//Handle all emails
var config = require('config');
var mail = {};
var fs = require('fs');
var _ = require('lodash');

var mandrill = require('node-mandrill')(config.mail.mandrillKey);

mail.sendMail = function (to,subject,body,from,name) {
	//send an e-mail to jim rubenstein
	mandrill('/messages/send', {
	    message: {
	        to: [{email: to, name: name || 'C2C User'}],
	        from_email: from || config.mail.from,
	        subject: subject,
	        text: body
	    }
	}, function(error, response)
	{
	    //uh oh, there was an error
	    if (error) console.log( JSON.stringify(error) );

	    //everything's good, lets see what mandrill said
	    else console.log(response);
	});
};


module.exports = mail;