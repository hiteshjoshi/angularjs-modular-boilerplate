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
  paypal : {
    'mode' :'sandbox',
    'host': 'api.sandbox.paypal.com',
    'port': '',
    'client_id': 'AaWwecwGXHkZkBoOKtWBzFPVhpURvnLhDZmzD8r2KQMqYJPUm2NnWCOM2_BlGPI7H73OWApnpg3zNMmi',
    'client_secret': 'ECCO8zbgih8H5Y2dlw7kzwXW45vjJbH3RmJOD4rypzXj8_WvsG6otOzoAZs9NKC05LNVc--03CDk6LVc'
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