//Handle all emails
var config = require('config');
var mail = {};
var fs = require('fs')

if(process.env.NODE_ENV != 'test'){


	var nodemailer = require('nodemailer');
	var smtpTransport = require('nodemailer-smtp-transport');
	//var client = require('campaign')();
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	
	var transporter = nodemailer.createTransport(smtpTransport({
		host: config.mail_server_IP,
		port: 587,
		authMethod:"CRAM-MD5",
		auth: {
	        user: 'matt',
	        pass: 'test'
	    }
	}));


	var n = new Date();
	var send = function(){
		transporter.sendMail({
		    from: 'anything@campusdope.com',
		    to: 'me@hiteshjoshi.com',
		    subject: 'Hello World!',
		    text: 'Authenticated with TLS'
		},function(err,i){
			send();
			console.log(err,i);
			console.log("I AM HERE");
		});
	}

	send();
		
}

module.exports = mail;