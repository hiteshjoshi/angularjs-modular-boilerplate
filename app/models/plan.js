
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
  price: { type: String, default: '' },
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
	reminder: {
	  	emails : {type:Number,default:0},
	  	text : {type:Number,default:0},
	  	voice : {type:Number,default:0}
	},
	members : {type:Number,default:1},
	paid:{type:Boolean,default:false}
});

mongoose.model('PlanUsage', PlanUsage);
mongoose.model('Plan', PlansSchema);