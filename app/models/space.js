//Space model is just a template file for understanding the code.

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var SpaceSchema   = new Schema({
	name: { type: String, default: '' },
	description : { type: String, default: '' },
	working_area : { type: Number, default: 0,index:true},
	total_seats : { type: Number, default: 0,index:true},
	cabins : { type: Boolean, default: false,index:true},
	internet :{
		speed : { type:Number,default:0 },
		type : { type:String,default:'Broadband' }
	},
	active : {type:Boolean,default:false,index:true},
	admins : [{type:ObjectId,ref:'User'}],
	managers : [{type:ObjectId,ref:'User'}],
	created : { type:Date,default:Date.now },
	rating : { type:Number,default:0 ,index:true}
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

SpaceSchema.method({

});

/**
 * Statics
 */
SpaceSchema.static({

});

/**
 * Register
 */

module.exports = mongoose.model('Space', SpaceSchema);