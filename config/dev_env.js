/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/noobjs_dev',
  sessionSecret: "thisisareallylongandbigsecrettoken",
  baseUrl:"http://costart.local:8000/",
  cookieDomain:".costart.local",
  logDir : './logs/', //@todo : check if log directory exits, if not create one.
  mandrill:{
    key : 'euczZoWZFKwJoRHR5YvYaA'
  },
  facebook: {
    clientID: '129068087114569',
    clientSecret: 'e292aa48fc231526e22ca18651d11008',
    callbackURL: 'http://costart.local:8080/auth/facebook/callback',
    scope: [
      'email',
      'user_about_me',
      'user_friends'
    ]
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'SECRET',
    callbackURL: 'http://localhost:8080/auth/google/callback',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.google.com/m8/feeds',
    ]
  },
  paypal : {
    'mode' :'sandbox',
    'host': 'api.sandbox.paypal.com',
    'port': '',
    'client_id': 'AaWwecwGXHkZkBoOKtWBzFPVhpURvnLhDZmzD8r2KQMqYJPUm2NnWCOM2_BlGPI7H73OWApnpg3zNMmi',
    'client_secret': 'ECCO8zbgih8H5Y2dlw7kzwXW45vjJbH3RmJOD4rypzXj8_WvsG6otOzoAZs9NKC05LNVc--03CDk6LVc',
    'username':'lorna_api1.caretocall.com',
    'password':'BELNK7NC2STDUNHN',
    'signature':'AFcWxV21C7fd0v3bYYYRCpSSRl31ApGwpTUvSNOBYVqdlcujjVrvKx12'
  }
};