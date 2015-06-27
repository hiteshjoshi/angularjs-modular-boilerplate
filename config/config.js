/**
 * Module dependencies.
 */

var path = require('path');
var extend = require('util')._extend;

var development = require('./dev_env');
var test = require('./test_env');
var production = require('./prod_env');

var defaults = {
  root: path.normalize(__dirname+'/../'),
  mail_server_IP : '128.199.184.52',//'mail.costart.in',//'10.130.177.109', //this only works on production server and thats because its local ip
  env:process.env.NODE_ENV || 'development',
  mail:{
    mandrillKey : 'pwABzp6CtEQKsLD-lUNx7g',
    from : 'system@caretocall.com'
  }
};

/**
 * Expose
 */

module.exports = {
  development: extend(development, defaults),
  test: extend(test, defaults),
  production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];