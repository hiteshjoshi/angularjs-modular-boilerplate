
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

/**
 * User Schema
 */

var PlansSchema = new Schema({
  name: { type: String, default: ''},
  description: { type: String, default: ''},
  reminder: {
  	emails : {type:Number,default:10},
  	text : {type:Number,default:10},
  	voice : {type:Number,default:10}
  },
  members : {type:Number,default:10},
  price: { type: Number, default: '' },
  users: { type: Number, default: 0 ,index:true}, //total number of customers opted for this plan
  created : {type:Date,default:Date.now},
  updated : {type:Date,default:Date.now},
  plan_type : {type:Number,default:1}, //1 = monthly, 2 = yearly
  active : {type:Boolean,default:false},
  paypalId:{ type: String, default: '' }
});

var PlanUsage = new Schema({
	user_id : {type : Schema.ObjectId, ref : 'User'},
	plan_id : {type : Schema.ObjectId, ref : 'Plan'},
	joined : {type:Date,default:Date.now},
	expiring:{type:Date,default:Date.now},
	used: {
	  	emails : {type:Number,default:0},
	  	text : {type:Number,default:0},
	  	voice : {type:Number,default:0}
	},
	members : {type:Number,default:1},
	paid:{type:Boolean,default:false},
  processed:{type:Boolean,default:false},
  hash:{type:String,default:''},
  hex:{type:String,default:''},
  paypalId:{type:String,default:''}
});

var Reminder = new Schema({
  user : {type : Schema.ObjectId, ref : 'User',index:true},
  created : {type:Date,default:Date.now},
  title : { type: String, default: '' },
  notify_by:{
    email:{ type: Boolean, default: true },
    text:{ type: Boolean, default: true },
    voice:{ type: Boolean, default: true }
  },
  recipients:{type:[],default:[]},//Schema.ObjectId
  text_sms : { type: String, default: '' },
  email : { type: String, default: '' },
  number_voice_recording:{ type: Number, default: '' },
  schedule_date : { type: Date},
  //start: { type: Date},
  //schedule_time : { type: String, default: '' },
  recurring : { type: Boolean, default: true },
  recurring_frequency : { type: Number, default: 1 }, //1=weekly, 2=monthly, 3= daily
  reassurance_reminder : {type:Boolean,default:false},
  reassurance_attempts : {type : Number,default:0},
  alert : {type:Boolean,default:false}
});




var Paypal = new Schema({
  paypalId : { type: String, default: '' },
  plan : {type : Schema.ObjectId, ref : 'Plan'},
  created : { type: Date,default:Date.now}
});


mongoose.model('Paypal', Paypal);
mongoose.model('PlanUsage', PlanUsage);
mongoose.model('Plan', PlansSchema);
mongoose.model('Reminder', Reminder);