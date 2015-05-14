//Bear model is just a template file for understanding the code.

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var BearSchema   = new Schema({
	name: String
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

BearSchema.method({

});

/**
 * Statics
 */
BearSchema.static({

});

/**
 * Register
 */

module.exports = mongoose.model('Bear', BearSchema);