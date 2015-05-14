//Session model is just a template file for understanding the code.

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var uuid = require('node-uuid')

var SessionSchema   = new Schema({
	user : {type:ObjectId,ref:'User'},
	created : {type:Date,default:Date.now},
	updated : {type:Date,default:Date.now},
	token : {type:String,default:uuid.v1(),index:true}
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

SessionSchema.method({

});

/**
 * Statics
 */
SessionSchema.static({

});

/**
 * Register
 */

module.exports = mongoose.model('Session', SessionSchema);