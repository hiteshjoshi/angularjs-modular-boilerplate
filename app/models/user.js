
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

/**
 * User Schema
 */


var careGiver = new Schema({
    first_name : String,
    last_name : String,
    landline : Number,
    mobile : Number,
    time_zone:{type:String,default:"Pacific"},
    email_address:String,
    preferred_number:Number //1 = mobile or 2= landline
});


var UserSchema = new Schema({
  firstName: { type: String, default: '' ,index:"text"},
  lastName: { type: String, default: '' ,index:"text"},
  email: { type: String, default: '' ,index:"text"},
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  is_admin : {type:Boolean,default:false,index:true},
  joined : {type:Date,default:Date.now},
  email_verified:{type:Boolean,default:false},
  care_giver:{type:[careGiver],default:[]},
  landline : {type:String,default:null},
  mobile : {type:String,default:null},
  invite_code : {type:String,default:null}, //invite code sent by admin of respective company
  unique_code:{type:String,index:{unique:true}}, //used to forgot password for verify email address
  preferred_number:{type:Number,default:1}, //1 = mobile or 2= landline
  billing_details:{
    address_1:{type:String,default:''},
    address_2:{type:String,default:''},
    city:{type:String,default:''},
    state:{type:String,default:''},
    postal:{type:String,default:''},
    country_code:{type:String,default:''},
    timezone:{type:String,default:"Pacific"},
  },
  plan : {type : Schema.ObjectId, ref : 'Plan'}
});



/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

// UserSchema.path('firstName').validate(function (name) {
//   if (this.skipValidation()) return true;
//   return name.length;
// }, 'Name cannot be blank');

// UserSchema.path('lastName').validate(function (name) {
//   if (this.skipValidation()) return true;
//   return name.length;
// }, 'Name cannot be blank');


UserSchema.path('email').validate(function (email) {
  if (this.skipValidation()) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');
  if (this.skipValidation()) fn(true);

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Email already exists');


UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (this.skipValidation()) return true;
  return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.skipValidation()) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
})

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */

  skipValidation: function() {
    return false;
  }
};

/**
 * Statics
 */

UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name username is_admin';
    this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}

mongoose.model('User', UserSchema);
