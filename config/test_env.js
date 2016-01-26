/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/shithere',
  sessionSecret: "thisisareallylongandbigsecrettoken",
  baseUrl:"http://api.costart.local:8000/",
  cookieDomain:".costart.local",
  logDir : './logs/', //@todo : check if log directory exits, if not create one.
  mandrill:{
    key : 'euczZoWZFKwJoRHR5YvYaA'
  },
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
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
  }
};