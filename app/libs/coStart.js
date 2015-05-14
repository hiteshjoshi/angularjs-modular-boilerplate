//all the static data on this file
var coStart = {};


/*********************
	Ask Parrot plans
*********************/
var plans = {};
plans[1] = {
	name : "Forever free",
	price : 0,
	max_users : 2
};
/*********************
	End listing plans
*********************/


/*********************
	Roles for user to join a company at askparrot.com
*********************/
var roles = {};

roles[1] = {
	name : "Customer support executive",
	id : 1
};
roles[2] = {
	name : "Customer officer",
	id : 2
};
roles[3] = {
	name : "Admin",
	id : 3
};
/*********************
	End listing Roles 
*********************/





/*********************
	Gender to number conversion for user
	s = query , rever = if vice versa
*********************/
var genderNumber = function (s,reverse) {
	if(!reverse)
		switch(s){
			case 'male' : return 1;

			case 'female' : return 0;

			case 'others' : return 2;

			default : return 2;

		}
	else
		switch(s){
			
			case 1 : return 'male';

			case 0 : return 'female';

			case 2 : return 'others';

			default : return 'others';
		}
};

/*********************
	End listing Gender 
*********************/




coStart.plans = plans;
coStart.roles = roles;
coStart.genderNumber = genderNumber;

module.exports = coStart;