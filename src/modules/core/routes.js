'use strict';

function routes() {
  //The routes for this website.
  var dashboard = require('./controllers/dashboard');

  return {
    '/': dashboard
  };
}
exports.routes = routes;