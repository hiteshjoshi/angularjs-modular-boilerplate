var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var coStart = require('coStart');

var InviteSchema = new Schema({
  email: { type: String, default: '' },
  company:{type:ObjectId,ref:'Company'},
  role:{type:Number,default:coStart.roles[1].id},
  invite_code : {type:String,default:null},
  invited_by : {type:ObjectId,ref:'user'} //id of user who invited this fellow.
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

InviteSchema.method({

});

/**
 * Statics
 */

InviteSchema.static({

});

/**
 * Register
 */

mongoose.model('Invite', InviteSchema);