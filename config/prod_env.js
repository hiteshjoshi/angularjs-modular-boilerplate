/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/noobjs_dev',
  sessionSecret: "thisisareallylongandbigsecrettoken",
  baseUrl:"http://costart.in/",
  cookieDomain:".costart.in",
  logDir : '/var/log/api/', //@todo : check if log directory exits, if not create one.
  mandrill:{
    key : 'euczZoWZFKwJoRHR5YvYaA'
  },
  facebook: {
    clientID: '122699894436166',
    clientSecret: 'e6a67961ca47e6e7f180a653dfb8f81c',
    callbackURL: 'http://api.costart.in/auth/facebook/callback',
    scope: [
      'email',
      'user_about_me',
      'user_friends'
    ]
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.google.com/m8/feeds',
    ]
  },
  paypal : {
    'mode' :'live',
    'host': 'api.paypal.com',
    'port': '',
    'client_id': 'AYEuHDPWGFsj6hfct5W-ikizJ-MMqRIjoB4r8Drfo1fWZyvSHXW4Lzh5rH1BBcA1eip9s_ZBkQKDl0SP',
    'client_secret': 'EFXv3BgirJiuynXRLYZDkn0dfA7Hv4mJ4osqPjps_Ua0a5y31ghh1MezT9cFnBMdYpAM_f8TXjbulVBS'
  }
};