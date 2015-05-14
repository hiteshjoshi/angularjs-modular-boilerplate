var mongoose = require('mongoose');
var Session = mongoose.model('Session');
var session = {};


var resData = {
	error:false,
	code:"",
	data:null,
	userMessage:''
};


session.checkToken = function(req,res,next){

	var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        bearerToken = bearerToken.slice(1,bearerToken.length).slice(0,-1);

        

        //get User for this session
        Session
        .findOneAndUpdate({
        	token:bearerToken
        },{updated:new Date()})
        .populate('user',{firstName:1,lastName:1,_id:1,email_verified:1,email:1,is_admin:1})
        .lean()
        .exec(function(err,user){
        	if(user && !err){
                req.user = user.user;
        		next();
        	}
        	else
        		if(err){
        			resData.userMessage = "Server error!";
        			res.status(500).json(resData);
        		}
        		else{
        			resData.userMessage = "Your session has been expired. Please relogin.";
        			res.status(401).json(resData);
        		}
        })

        
    } else {
        resData.userMessage = "Your session has been expired. Please relogin.";
		res.status(403).json(resData);
    }
};


session.masterToken = function(req,res,next){

};
session.newMasterSession = function(){

};


module.exports = session;
