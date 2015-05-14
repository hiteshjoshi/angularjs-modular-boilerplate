//Handle all emails
var mail = {};
var fs = require('fs')
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
//var client = require('campaign')();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var transporter = nodemailer.createTransport(smtpTransport({
	host: 'mail.campusdope.com',
	port: 587,
	authMethod:"CRAM-MD5",
	auth: {
        user: 'matt',
        pass: 'test'
    }
}));


var mails = 0;
var sendTestMail = function(){
	transporter.sendMail({
	    from: 'anything@campusdope.com',
	    to: 'hitesh.webmaker@gmail.com',
	    subject: 'Hello World!',
	    text: 'TEST email from email server.'
	},function(err,i){
		mails++;
		console.log(i,mails, "SENT TO FAR!!!!!----------------!!!!")
		if(err)
			throw err;
	});
}

var Things = 1000;

for (var i = Things - 1; i >= 0; i--) {
	console.log(Things,"THIS IS FUKCING IDIOTIC");
	sendTestMail();
};

//lets shoot.
sendTestMail();

module.exports = mail;