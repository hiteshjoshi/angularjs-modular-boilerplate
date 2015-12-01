'use strict';

<<<<<<< HEAD
/**
 * App module
 * @desc: Main application setup
 */
var app = angular.module('app', [
  /** THIRD party modules **/
  'mm.foundation',
  'angular-parallax',
  'permission',
  'ngLodash',
  'angularMoment',
  'ngSanitize',
  'ui.select2',
  'ui.tinymce',
  /** core modules */
  'app.core',
  /** others modules */
  'app.dashboard',
  'app.homepage'
]);

/**
 * load up our modules
 */
require('moduleDir/core/core');
require('moduleDir/dashboard/dashboard');
require('moduleDir/homepage/homepage');

/**
 * bootstrap our App
 */
angular.element(document).ready(function () {
  angular.bootstrap(document, ['app']);
});
=======
//require('moduleDir/core/core');

var m  = require('mithril');
//namespace 
var app = {};
 
//model 
app.PageList = function() {
    return m.request({method: "GET", url: "pages.json"});
};
 
//controller 
app.controller = function() {
    var pages = app.PageList();
    return {
        pages: pages,
        rotate: function() {
            pages().push(pages().shift());
        }
    };
};
 
//view 
app.view = function(ctrl) {
    return [
        ctrl.pages().map(function(page) {
            return m("a", {href: page.url}, page.title);
        }),
        m("button", {onclick: ctrl.rotate}, "Rotate links")
    ];
};
 
 
//initialize 
m.module(document.body, app);
>>>>>>> f8edfb23ff040fa16ba94d217d1f05edc02fd8cc
