/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/your_project_development',
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
  }
};